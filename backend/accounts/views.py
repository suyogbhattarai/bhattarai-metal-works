from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone

# Import utility functions and serializers
from accounts.utils.responses import success_response, error_response, get_tokens_for_user
from .serializers import UserRegistrationSerializer, UserProfileSerializer, AddressSerializer
from .models import CustomUser, Address


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

