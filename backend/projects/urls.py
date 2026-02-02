from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProjectAssignmentViewSet, ProjectPaymentViewSet

app_name = 'projects'

router = DefaultRouter()
router.register(r'list', ProjectViewSet)
router.register(r'assignments', ProjectAssignmentViewSet)
router.register(r'payments', ProjectPaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
