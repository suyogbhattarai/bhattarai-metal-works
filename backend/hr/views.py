from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import StaffProfile, Attendance, Payroll
from .serializers import StaffProfileSerializer, AttendanceSerializer, PayrollSerializer, StaffCreateSerializer, StaffUpdateSerializer

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_staff or request.user.role in ['admin', 'staff'])

class StaffProfileViewSet(viewsets.ModelViewSet):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer
    permission_classes = [IsAdminOrStaff]

    def get_serializer_class(self):
        if self.action == 'create':
            return StaffCreateSerializer
        if self.action in ['update', 'partial_update']:
            return StaffUpdateSerializer
        return StaffProfileSerializer

    def perform_destroy(self, instance):
        if instance.user:
            instance.user.delete()
        else:
            instance.delete()

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrStaff]

    def perform_create(self, serializer):
        # Automatically set staff if not provided (optionally)
        serializer.save()

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAdminOrStaff]
