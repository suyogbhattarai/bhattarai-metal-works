# ============================================================
# FILE 3: urls.py
# ============================================================

from django.urls import path
from accounts import views

urlpatterns = [
    # ============================================================
    # AUTHENTICATION ENDPOINTS
    # ============================================================
    
    # User registration
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # User login
    path('login/', views.LoginView.as_view(), name='login'),
    
    
    # ============================================================
    # USER PROFILE MANAGEMENT ENDPOINTS
    # ============================================================
    
    # Get/Update user profile
    path('profile/', views.UserProfileView.as_view(), name='profile_detail_update'),

    
    # ============================================================
    # ADDRESS MANAGEMENT ENDPOINTS
    # ============================================================
    
    # List all addresses for user or create new address
    path('addresses/', views.AddressListCreateView.as_view(), name='address_list_create'),
    
    # Retrieve, update, or delete specific address
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address_detail_update_delete'),

    
    # ============================================================
    # ADMIN USER MANAGEMENT ENDPOINTS (ADMIN ONLY)
    # ============================================================
    
    # Get user statistics and analytics
    path('users/stats/', views.AdminUserStatsView.as_view(), name='admin_user_stats'),
    
    # Bulk user actions (activate, deactivate, delete)
    path('users/bulk-action/', views.AdminBulkUserActionView.as_view(), name='admin_bulk_user_action'),
    
    # List all users with filtering and search
    path('users/', views.AdminUserListView.as_view(), name='admin_user_list'),
    
    # Retrieve, update, or delete specific user
    path('users/<int:id>/', views.AdminUserDetailView.as_view(), name='admin_user_detail'),
    
    # Change user role
    path('users/<int:pk>/change-role/', views.AdminUserRoleChangeView.as_view(), name='admin_change_user_role'),
]