from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import PortfolioCategory, PortfolioProject, PortfolioProjectImage
from .serializers import (
    PortfolioCategorySerializer, 
    PortfolioProjectSerializer, 
    PortfolioProjectImageSerializer
)

class PortfolioCategoryViewSet(viewsets.ModelViewSet):
    queryset = PortfolioCategory.objects.all()
    serializer_class = PortfolioCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class PortfolioProjectViewSet(viewsets.ModelViewSet):
    queryset = PortfolioProject.objects.all()
    serializer_class = PortfolioProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'is_featured']
    search_fields = ['title', 'description', 'client_name', 'location']
    ordering_fields = ['order', 'completion_date', 'created_at']

    def perform_create(self, serializer):
        project = serializer.save()
        images_data = self.request.FILES.getlist('upload_images')
        for image_data in images_data:
            PortfolioProjectImage.objects.create(project=project, image=image_data)

    def perform_update(self, serializer):
        project = serializer.save()
        
        # Handle removals
        remove_ids = self.request.data.getlist('remove_images')
        if remove_ids:
            PortfolioProjectImage.objects.filter(id__in=remove_ids, project=project).delete()
            
        # Handle uploads
        images_data = self.request.FILES.getlist('upload_images')
        for image_data in images_data:
            PortfolioProjectImage.objects.create(project=project, image=image_data)

class PortfolioProjectImageViewSet(viewsets.ModelViewSet):
    queryset = PortfolioProjectImage.objects.all()
    serializer_class = PortfolioProjectImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
