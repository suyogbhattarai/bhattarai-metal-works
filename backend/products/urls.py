from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    ProductListCreateView, ProductDetailView, FeaturedProductsView,
    ProductReviewListCreateView, ProductReviewDetailView,
    QuotationRequestListCreateView, QuotationRequestDetailView,
    ServiceBookingListCreateView, ServiceBookingDetailView,
    SearchView, MaterialListCreateView, MaterialDetailView,
    SpecificationListCreateView, SpecificationDetailView,
    ProductSpecificationListCreateView, ProductSpecificationDetailView,
    ProductMaterialListCreateView, ProductMaterialDetailView
)

app_name = 'products'

urlpatterns = [
    # ============= CATEGORIES =============
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # ============= MATERIALS (Global) =============
    path('materials/', MaterialListCreateView.as_view(), name='material-list-create'),
    path('materials/<int:pk>/', MaterialDetailView.as_view(), name='material-detail'),
    
    # ============= SPECIFICATIONS (Global) =============
    path('specifications/', SpecificationListCreateView.as_view(), name='specification-list-create'),
    path('specifications/<int:pk>/', SpecificationDetailView.as_view(), name='specification-detail'),
    
    # ============= QUOTATION REQUESTS =============
    # MUST come before <slug:slug>/ pattern
    path('quotations/', QuotationRequestListCreateView.as_view(), name='quotation-list-create'),
    path('quotations/<int:pk>/', QuotationRequestDetailView.as_view(), name='quotation-detail'),
    
    # ============= SERVICE BOOKINGS =============
    # MUST come before <slug:slug>/ pattern
    path('bookings/', ServiceBookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', ServiceBookingDetailView.as_view(), name='booking-detail'),
    
    # ============= SEARCH =============
    # MUST come before <slug:slug>/ pattern
    path('search/', SearchView.as_view(), name='search'),
    
    # ============= PRODUCTS - LIST & CREATE =============
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    
    # ============= FEATURED PRODUCTS =============
    # MUST come before <slug:slug>/ pattern
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    
    # ============= PRODUCT MATERIALS (Product-Specific) =============
    # MUST come before <slug:slug>/ pattern (more specific)
    path('<slug:slug>/materials/', ProductMaterialListCreateView.as_view(), name='product-materials-list'),
    path('<slug:slug>/materials/<int:material_id>/', ProductMaterialDetailView.as_view(), name='product-material-detail'),
    
    # ============= PRODUCT SPECIFICATIONS (Product-Specific) =============
    # MUST come before <slug:slug>/ pattern (more specific)
    path('<slug:slug>/specifications/', ProductSpecificationListCreateView.as_view(), name='product-specifications-list'),
    path('<slug:slug>/specifications/<int:spec_id>/', ProductSpecificationDetailView.as_view(), name='product-specification-detail'),
    
    # ============= PRODUCT REVIEWS (Product-Specific) =============
    # MUST come before <slug:slug>/ pattern (more specific)
    path('<slug:slug>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    
    # ============= PRODUCT DETAIL (CATCH-ALL - MUST BE LAST) =============
    # This is the catch-all pattern, so it MUST be last
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    
    # ============= REVIEW DETAIL (for editing reviews) =============
    # This can be placed here or at top - doesn't conflict
    path('reviews/<int:pk>/', ProductReviewDetailView.as_view(), name='review-detail'),
]