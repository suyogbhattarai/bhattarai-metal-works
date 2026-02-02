from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffProfileViewSet, AttendanceViewSet, PayrollViewSet

app_name = 'hr'

router = DefaultRouter()
router.register(r'staff', StaffProfileViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'payroll', PayrollViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
