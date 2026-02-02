"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    docs.djangoproject.com
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Import settings
from django.conf.urls.static import static # Import static file utilities

# Import only the necessary simplejwt view for token refresh (login is custom now)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
 
    # This 'accounts.urls' includes your custom /register/ and /login/ endpoints
    path('api/accounts/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/hr/', include('hr.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    # JWT token endpoint for refreshing the access token (login is now handled by accounts.views.LoginView)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files in development only
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Optional: Serving static files via runserver (standard behavior but explicit here)
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    