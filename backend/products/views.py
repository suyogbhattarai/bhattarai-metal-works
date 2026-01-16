from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from accounts.utils.responses import success_response, error_response

from .models import (
    Category, Product, Review, QuotationRequest, ServiceBooking
)
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateUpdateSerializer, ReviewSerializer, ReviewCreateSerializer, 
    QuotationRequestSerializer, ServiceBookingSerializer
)
from .filters import ProductFilter


# ============= HELPER FUNCTION =============

def is_admin_or_staff(user):
    """Check if user is admin or staff"""
    return user and user.is_authenticated and (user.is_staff or user.is_superuser)


# ============= CATEGORY VIEWS =============

class CategoryListCreateView(APIView):
    """List all categories (public) or create a new one (admin/staff only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return success_response("Categories retrieved", {'results': serializer.data})

    def post(self, request, *args, **kwargs):
        # Only admin/staff can create
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to create categories. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CategorySerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid category data", serializer.errors)
        
        serializer.save()
        return success_response("Category created successfully", serializer.data, status.HTTP_201_CREATED)


class CategoryDetailView(APIView):
    """Retrieve category (public) or update/delete (admin/staff only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, pk, *args, **kwargs):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, context={'request': request})
        return success_response("Category retrieved", serializer.data)

    def put(self, request, pk, *args, **kwargs):
        # Only admin/staff can update
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to update categories. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid category data", serializer.errors)
        
        serializer.save()
        return success_response("Category updated", serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        # Only admin/staff can patch
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to update categories. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid category data", serializer.errors)
        
        serializer.save()
        return success_response("Category updated", serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        # Only admin/staff can delete
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to delete categories. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        return success_response("Category deleted", status_code=status.HTTP_204_NO_CONTENT)


# ============= PRODUCT VIEWS =============

class ProductListCreateView(APIView):
    """List products with filtering (public) or create a new product (admin/staff only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'materials', 'reviews')
        
        # Filter by category slug
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by featured
        is_featured = request.query_params.get('is_featured')
        if is_featured and is_featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by product type
        product_type = request.query_params.get('product_type')
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        
        # Filter by price range
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(base_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(base_price__lte=max_price)
        
        # Filter by in stock
        in_stock = request.query_params.get('in_stock')
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # Search
        search_query = request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        
        # Ordering
        ordering = request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        serializer = ProductListSerializer(queryset, many=True, context={'request': request})
        return success_response(
            f"Found {len(serializer.data)} products",
            {'results': serializer.data}
        )

    def post(self, request, *args, **kwargs):
        # Only admin/staff can create
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to create products. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ProductCreateUpdateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid product data", serializer.errors)
        
        serializer.save()
        return success_response("Product created successfully", serializer.data, status.HTTP_201_CREATED)


class ProductDetailView(APIView):
    """Retrieve product (public) or update/delete (admin/staff only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, slug, *args, **kwargs):
        product = get_object_or_404(
            Product.objects.filter(is_active=True).select_related('category').prefetch_related(
                'images', 'materials', 'specifications', 'reviews__user'
            ),
            slug=slug
        )
        serializer = ProductDetailSerializer(product, context={'request': request})
        return success_response("Product retrieved", serializer.data)

    def put(self, request, slug, *args, **kwargs):
        # Only admin/staff can update
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to update products. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        product = get_object_or_404(Product, slug=slug)
        serializer = ProductCreateUpdateSerializer(
            product, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return error_response("Invalid product data", serializer.errors)
        
        serializer.save()
        return success_response("Product updated", serializer.data)

    def patch(self, request, slug, *args, **kwargs):
        # Only admin/staff can patch
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to update products. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        product = get_object_or_404(Product, slug=slug)
        serializer = ProductCreateUpdateSerializer(
            product, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return error_response("Invalid product data", serializer.errors)
        
        serializer.save()
        return success_response("Product updated", serializer.data)

    def delete(self, request, slug, *args, **kwargs):
        # Only admin/staff can delete
        if not is_admin_or_staff(request.user):
            return error_response(
                "You do not have permission to delete products. Admin/Staff access required.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        product = get_object_or_404(Product, slug=slug)
        product.delete()
        return success_response("Product deleted", status_code=status.HTTP_204_NO_CONTENT)


# ============= FEATURED PRODUCTS VIEW =============

class FeaturedProductsView(APIView):
    """Get featured products for homepage (public)"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        products = Product.objects.filter(
            is_active=True, 
            is_featured=True
        ).select_related('category').prefetch_related('images')[:8]
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return success_response(
            f"Found {len(serializer.data)} featured products",
            {'results': serializer.data}
        )


# ============= PRODUCT REVIEW VIEWS =============

class ProductReviewListCreateView(APIView):
    """List approved reviews (public) or create a new review (logged in users only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, slug, *args, **kwargs):
        # Verify product exists
        get_object_or_404(Product, slug=slug)
        
        reviews = Review.objects.filter(
            product__slug=slug,
            is_approved=True
        ).select_related('user')
        
        serializer = ReviewSerializer(reviews, many=True, context={'request': request})
        return success_response(
            f"Found {len(serializer.data)} reviews",
            {'results': serializer.data}
        )

    def post(self, request, slug, *args, **kwargs):
        # Require authentication (any logged in user)
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required to submit a review",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        product = get_object_or_404(Product, slug=slug)
        
        # Check if user already reviewed this product
        if Review.objects.filter(product=product, user=request.user).exists():
            return error_response(
                "You have already reviewed this product",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ReviewCreateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid review data", serializer.errors)
        
        serializer.save(user=request.user, product=product)
        return success_response("Review submitted for approval", serializer.data, status.HTTP_201_CREATED)


class ProductReviewDetailView(APIView):
    """Retrieve review (public) or update/delete (own review only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, pk, *args, **kwargs):
        review = get_object_or_404(Review, pk=pk, is_approved=True)
        serializer = ReviewSerializer(review, context={'request': request})
        return success_response("Review retrieved", serializer.data)

    def put(self, request, pk, *args, **kwargs):
        # User must own the review
        review = get_object_or_404(Review, pk=pk)
        if review.user != request.user:
            return error_response(
                "You can only edit your own reviews",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ReviewCreateSerializer(review, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid review data", serializer.errors)
        
        serializer.save()
        return success_response("Review updated", serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        # User must own the review
        review = get_object_or_404(Review, pk=pk)
        if review.user != request.user:
            return error_response(
                "You can only edit your own reviews",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ReviewCreateSerializer(review, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid review data", serializer.errors)
        
        serializer.save()
        return success_response("Review updated", serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        # User must own the review
        review = get_object_or_404(Review, pk=pk)
        if review.user != request.user:
            return error_response(
                "You can only delete your own reviews",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        review.delete()
        return success_response("Review deleted", status_code=status.HTTP_204_NO_CONTENT)


# ============= QUOTATION REQUEST VIEWS =============

class QuotationRequestListCreateView(APIView):
    """List user's quotation requests (logged in users) or create new one (guest/logged in)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        # Require authentication for listing
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        quotations = QuotationRequest.objects.filter(
            user=request.user
        ).select_related('product').prefetch_related('attachments')
        
        serializer = QuotationRequestSerializer(quotations, many=True, context={'request': request})
        return success_response(
            f"Found {len(serializer.data)} quotation requests",
            {'results': serializer.data}
        )

    def post(self, request, *args, **kwargs):
        # Anyone can create (guest or logged in)
        serializer = QuotationRequestSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid quotation request", serializer.errors)
        
        serializer.save()
        message = "Quotation request submitted successfully. We'll get back to you within 24 hours."
        return success_response(message, serializer.data, status.HTTP_201_CREATED)


class QuotationRequestDetailView(APIView):
    """View, update, or delete quotation request (user's own only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        quotation = get_object_or_404(QuotationRequest, pk=pk, user=request.user)
        serializer = QuotationRequestSerializer(quotation, context={'request': request})
        return success_response("Quotation request retrieved", serializer.data)

    def put(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        quotation = get_object_or_404(QuotationRequest, pk=pk, user=request.user)
        
        # Only allow updates if status is pending or reviewing
        if quotation.status not in ['pending', 'reviewing']:
            return error_response(
                "Cannot update quotation in current status",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = QuotationRequestSerializer(quotation, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid update data", serializer.errors)
        
        serializer.save()
        return success_response("Quotation request updated", serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        quotation = get_object_or_404(QuotationRequest, pk=pk, user=request.user)
        
        # Only allow updates if status is pending or reviewing
        if quotation.status not in ['pending', 'reviewing']:
            return error_response(
                "Cannot update quotation in current status",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = QuotationRequestSerializer(quotation, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid update data", serializer.errors)
        
        serializer.save()
        return success_response("Quotation request updated", serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        quotation = get_object_or_404(QuotationRequest, pk=pk, user=request.user)
        quotation.delete()
        return success_response("Quotation request deleted", status_code=status.HTTP_204_NO_CONTENT)


# ============= SERVICE BOOKING VIEWS =============

class ServiceBookingListCreateView(APIView):
    """List user's service bookings (logged in users only) or create new booking (logged in users only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        bookings = ServiceBooking.objects.filter(
            user=request.user
        ).select_related('product', 'service_address')
        
        serializer = ServiceBookingSerializer(bookings, many=True, context={'request': request})
        return success_response(
            f"Found {len(serializer.data)} service bookings",
            {'results': serializer.data}
        )

    def post(self, request, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        serializer = ServiceBookingSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid booking data", serializer.errors)
        
        serializer.save(user=request.user)
        return success_response("Service booking created successfully", serializer.data, status.HTTP_201_CREATED)


class ServiceBookingDetailView(APIView):
    """View, update, or delete service booking (user's own only)"""
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        booking = get_object_or_404(ServiceBooking, pk=pk, user=request.user)
        serializer = ServiceBookingSerializer(booking, context={'request': request})
        return success_response("Service booking retrieved", serializer.data)

    def put(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        booking = get_object_or_404(ServiceBooking, pk=pk, user=request.user)
        
        # Only allow updates if status is pending
        if booking.status != 'pending':
            return error_response(
                "Cannot update booking in current status",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ServiceBookingSerializer(booking, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid update data", serializer.errors)
        
        serializer.save()
        return success_response("Service booking updated", serializer.data)

    def patch(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        booking = get_object_or_404(ServiceBooking, pk=pk, user=request.user)
        
        # Only allow updates if status is pending
        if booking.status != 'pending':
            return error_response(
                "Cannot update booking in current status",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ServiceBookingSerializer(booking, data=request.data, partial=True, context={'request': request})
        if not serializer.is_valid():
            return error_response("Invalid update data", serializer.errors)
        
        serializer.save()
        return success_response("Service booking updated", serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        # Require authentication
        if not request.user.is_authenticated:
            return error_response(
                "Authentication required",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        booking = get_object_or_404(ServiceBooking, pk=pk, user=request.user)
        
        # Only allow cancellation if status is pending or confirmed
        if booking.status in ['completed', 'cancelled']:
            return error_response(
                "Cannot cancel booking in current status",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'cancelled'
        booking.save()
        
        return success_response("Service booking cancelled", status_code=status.HTTP_204_NO_CONTENT)


# ============= SEARCH VIEW =============

class SearchView(APIView):
    """Global search across products (public)"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '')
        
        if len(query) < 2:
            return error_response("Search query must be at least 2 characters")
        
        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__name__icontains=query) |
            Q(materials__name__icontains=query),
            is_active=True
        ).distinct()[:20]
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        
        return success_response(
            f"Found {len(serializer.data)} results",
            {'results': serializer.data, 'query': query}
        )