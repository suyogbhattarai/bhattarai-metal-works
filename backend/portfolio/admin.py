from django.contrib import admin
from .models import PortfolioCategory, PortfolioProject, PortfolioProjectImage

class PortfolioProjectImageInline(admin.TabularInline):
    model = PortfolioProjectImage
    extra = 1

@admin.register(PortfolioCategory)
class PortfolioCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'project_count')
    prepopulated_fields = {'slug': ('name',)}

    def project_count(self, obj):
        return obj.projects.count()

@admin.register(PortfolioProject)
class PortfolioProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'client_name', 'client_logo', 'completion_date', 'is_featured', 'order')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'description', 'client_name', 'location')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PortfolioProjectImageInline]
    list_editable = ('is_featured', 'order')
