from rest_framework import serializers
from .models import PortfolioCategory, PortfolioProject, PortfolioProjectImage

class PortfolioProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioProjectImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class PortfolioCategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(source='projects.count', read_only=True)

    class Meta:
        model = PortfolioCategory
        fields = ['id', 'name', 'slug', 'description', 'project_count']

class PortfolioProjectSerializer(serializers.ModelSerializer):
    images = PortfolioProjectImageSerializer(many=True, read_only=True)
    category_detail = PortfolioCategorySerializer(source='category', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioProject
        fields = [
            'id', 'title', 'slug', 'category', 'category_detail', 'description', 
            'client_name', 'client_logo', 'location', 'completion_date', 'is_featured', 
            'order', 'images', 'primary_image', 'meta_title', 'meta_description', 
            'meta_keywords', 'created_at', 'updated_at'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            return PortfolioProjectImageSerializer(primary, context=self.context).data
        return None
