from rest_framework import viewsets, permissions
from .models import Project, ProjectAssignment, ProjectPayment
from .serializers import ProjectSerializer, ProjectAssignmentSerializer, ProjectPaymentSerializer

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.role in ['admin', 'staff'])

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrStaff]

class ProjectAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectAssignment.objects.all()
    serializer_class = ProjectAssignmentSerializer
    permission_classes = [IsAdminOrStaff]

class ProjectPaymentViewSet(viewsets.ModelViewSet):
    queryset = ProjectPayment.objects.all()
    serializer_class = ProjectPaymentSerializer
    permission_classes = [IsAdminOrStaff]
