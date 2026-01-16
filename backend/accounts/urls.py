from django.urls import path
from accounts import views

urlpatterns = [
    # --- Authentication Endpoints ---
    path('register/', views.RegisterView.as_view(), name='register'),
    # Custom Login View
    path('login/', views.LoginView.as_view(), name='login'),
    
    # --- User Profile Management Endpoints ---
    path('profile/', views.UserProfileView.as_view(), name='profile_detail_update'),

    # --- Address Management Endpoints ---
    path('addresses/', views.AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address_detail_update_delete'),
]
