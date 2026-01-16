from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    ProductListCreateView, ProductDetailView, FeaturedProductsView,
    ProductReviewListCreateView, ProductReviewDetailView,
    QuotationRequestListCreateView, QuotationRequestDetailView,
    ServiceBookingListCreateView, ServiceBookingDetailView,
    SearchView
)

app_name = 'products'

urlpatterns = [
    # Categories - CRUD
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # Products - CRUD (Images handled in same endpoint)
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    
    # Reviews - CRUD
    path('<slug:slug>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('reviews/<int:pk>/', ProductReviewDetailView.as_view(), name='review-detail'),
    
    # Quotation Requests - CRUD
    path('quotations/', QuotationRequestListCreateView.as_view(), name='quotation-list-create'),
    path('quotations/<int:pk>/', QuotationRequestDetailView.as_view(), name='quotation-detail'),
    
    # Service Bookings - CRUD
    path('bookings/', ServiceBookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', ServiceBookingDetailView.as_view(), name='booking-detail'),
    
    # Search
    path('search/', SearchView.as_view(), name='search'),
]