# ============================================================
# FILE 2: views.py
# ============================================================

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q, Count
import datetime

# Import utility functions and serializers
from accounts.utils.responses import success_response, error_response, get_tokens_for_user
from .serializers import (
    UserRegistrationSerializer, 
    UserProfileSerializer, 
    AddressSerializer,
    AdminUserListSerializer,
    AdminUserDetailSerializer,
    AdminUserRoleChangeSerializer,
    BulkUserActionSerializer
)
from .models import CustomUser, Address


# ============================================================
# PERMISSION CLASSES
# ============================================================

class IsAdmin(BasePermission):
    """
    Custom permission to check if user is an admin (superuser).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class IsAdminOrStaff(BasePermission):
    """
    Custom permission to check if user is admin or staff.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_superuser or request.user.is_staff))


# ============================================================
# PAGINATION
# ============================================================

class UserPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# ============================================================
# EXISTING VIEWS
# ============================================================

class RegisterView(APIView):
    """User registration endpoint"""
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid input data", serializer.errors)

        user = serializer.save() 
        tokens = get_tokens_for_user(user)

        data = {
            'user': UserProfileSerializer(user, context={'request': request}).data,
            'tokens': tokens,
        }
        return success_response("Registration successful", data, status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # ✅ Manually update last_login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            tokens = get_tokens_for_user(user)
            data = {
                'user': UserProfileSerializer(
                    user,
                    context={'request': request}
                ).data,
                'tokens': tokens,
            }
            return success_response("Login successful", data)

        return error_response(
            "Invalid username or password",
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  

    def get(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(
            request.user,
            context={'request': request}
        )
        return success_response("User profile retrieved", serializer.data)

    def put(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return success_response("User profile updated", serializer.data)
        return error_response("Failed to update profile", serializer.errors)


class AddressListCreateView(generics.ListCreateAPIView):
    """List user addresses or create a new one."""
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific address."""
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# ============================================================
# ADMIN VIEWS
# ============================================================

class AdminUserListView(generics.ListAPIView):
    """
    Admin-only endpoint to list all users in the system.
    Only superusers can access this endpoint.
    Supports filtering, searching, and ordering.
    
    Query Parameters:
        - search: Search by username, email, first_name, last_name
        - status: Filter by 'active' or 'inactive'
        - role: Filter by 'admin', 'staff', or 'user'
        - ordering: Order by field (default: -date_joined)
        - page_size: Number of results per page (default: 20, max: 100)
    """
    queryset = CustomUser.objects.all()
    serializer_class = AdminUserListSerializer
    permission_classes = [IsAdmin]
    pagination_class = UserPagination
    
    def get_queryset(self):
        """
        Filter and search users based on query parameters.
        """
        queryset = CustomUser.objects.all().annotate(addresses_count=Count('addresses'))
        
        # Search by username, email, first name, or last name
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(username__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query)
            )
        
        # Filter by active status
        status_filter = self.request.query_params.get('status', None)
        if status_filter in ['active', 'inactive']:
            is_active = status_filter == 'active'
            queryset = queryset.filter(is_active=is_active)
        
        # Filter by role
        role_filter = self.request.query_params.get('role', None)
        if role_filter == 'admin':
            queryset = queryset.filter(is_superuser=True)
        elif role_filter == 'staff':
            queryset = queryset.filter(is_staff=True, is_superuser=False)
        elif role_filter == 'user':
            queryset = queryset.filter(is_staff=False, is_superuser=False)
        
        # Ordering
        ordering = self.request.query_params.get('ordering', '-date_joined')
        queryset = queryset.order_by(ordering)
        
        return queryset


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin endpoint to retrieve, update, or delete a specific user.
    DELETE action soft-deletes by deactivating the user.
    
    Methods:
        GET: Retrieve user details
        PUT/PATCH: Update user information
        DELETE: Soft delete (deactivate) user
    """
    serializer_class = AdminUserDetailSerializer
    permission_classes = [IsAdmin]
    queryset = CustomUser.objects.all()
    lookup_field = 'id'
    
    def perform_destroy(self, instance):
        """Soft delete - deactivate user instead of hard delete"""
        instance.is_active = False
        instance.save()


class AdminUserRoleChangeView(APIView):
    """
    Admin endpoint to change user roles.
    
    POST /api/accounts/users/<id>/change-role/
    {
        "role": "admin" | "staff" | "user"
    }
    """
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        user = get_object_or_404(CustomUser, id=pk)
        
        # Prevent changing own role downward
        if request.user == user and request.data.get('role') == 'user':
            return error_response(
                "You cannot downgrade your own role",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AdminUserRoleChangeSerializer(
            data=request.data,
            context={'request': request, 'user': user}
        )
        
        if serializer.is_valid():
            role = serializer.validated_data['role']
            
            if role == 'admin':
                user.is_superuser = True
                user.is_staff = True
            elif role == 'staff':
                user.is_superuser = False
                user.is_staff = True
            else:  # user
                user.is_superuser = False
                user.is_staff = False
            
            user.save()
            return success_response(
                f"User role changed to {role}",
                AdminUserDetailSerializer(user, context={'request': request}).data
            )
        
        return error_response("Invalid role", serializer.errors)


class AdminBulkUserActionView(APIView):
    """
    Admin endpoint for bulk user actions.
    
    POST /api/accounts/users/bulk-action/
    {
        "user_ids": [1, 2, 3],
        "action": "activate" | "deactivate" | "delete"
    }
    """
    permission_classes = [IsAdmin]
    
    def post(self, request):
        serializer = BulkUserActionSerializer(data=request.data)
        
        if serializer.is_valid():
            user_ids = serializer.validated_data['user_ids']
            action = serializer.validated_data['action']
            
            # Prevent admin from including themselves in bulk actions
            if request.user.id in user_ids:
                return error_response(
                    "Cannot perform bulk actions on your own account",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            users = CustomUser.objects.filter(id__in=user_ids)
            
            if action == 'activate':
                updated_count = users.update(is_active=True)
                message = f"{updated_count} user(s) activated"
            elif action == 'deactivate':
                updated_count = users.update(is_active=False)
                message = f"{updated_count} user(s) deactivated"
            elif action == 'delete':
                # Soft delete
                updated_count = users.update(is_active=False)
                message = f"{updated_count} user(s) deleted"
            
            return success_response(message, {'updated_count': updated_count})
        
        return error_response("Invalid request data", serializer.errors)


class AdminUserStatsView(APIView):
    """
    Admin endpoint to get user statistics and analytics.
    GET /api/accounts/users/stats/
    """
    permission_classes = [IsAdmin]
    
    def get(self, request):
        total_users = CustomUser.objects.count()
        active_users = CustomUser.objects.filter(is_active=True).count()
        inactive_users = CustomUser.objects.filter(is_active=False).count()
        admins = CustomUser.objects.filter(is_superuser=True).count()
        staff_members = CustomUser.objects.filter(is_staff=True, is_superuser=False).count()
        regular_users = CustomUser.objects.filter(is_staff=False, is_superuser=False).count()
        
        # Users joined in last 30 days
        last_30_days = timezone.now() - datetime.timedelta(days=30)
        new_users = CustomUser.objects.filter(date_joined__gte=last_30_days).count()
        
        # Active in last 7 days
        last_7_days = timezone.now() - datetime.timedelta(days=7)
        active_last_week = CustomUser.objects.filter(last_login__gte=last_7_days).count()
        
        stats = {
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'admins': admins,
            'staff_members': staff_members,
            'regular_users': regular_users,
            'new_users_last_30_days': new_users,
            'active_last_7_days': active_last_week,
        }
        
        return success_response("User statistics", stats)