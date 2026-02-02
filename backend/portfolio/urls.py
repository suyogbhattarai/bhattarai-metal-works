from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioCategoryViewSet, PortfolioProjectViewSet, PortfolioProjectImageViewSet

router = DefaultRouter()
router.register(r'categories', PortfolioCategoryViewSet)
router.register(r'projects', PortfolioProjectViewSet)
router.register(r'images', PortfolioProjectImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
