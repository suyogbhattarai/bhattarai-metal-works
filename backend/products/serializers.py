from rest_framework import serializers
from django.db import models
from .models import (
    Category, Material, Product, ProductImage, Specification,
    Review, QuotationRequest, QuotationAttachment, ServiceBooking
)


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 
                  'product_count', 'created_at']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name', 'description']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class SpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specification
        fields = ['id', 'name', 'value', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'user_avatar', 'rating', 'title', 'comment',
                  'is_verified_purchase', 'created_at', 'updated_at']
        read_only_fields = ['user_name', 'user_avatar', 'is_verified_purchase']

    def get_user_avatar(self, obj):
        if obj.user.profile_picture:
            return obj.user.profile_picture.url
        return None


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'title', 'comment']


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product listing"""
    category = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    materials = serializers.StringRelatedField(many=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'description', 'product_type',
                  'base_price', 'is_price_visible', 'primary_image', 'materials',
                  'is_customizable', 'is_in_stock', 'is_low_stock', 'is_featured',
                  'average_rating', 'review_count', 'created_at']

    def get_primary_image(self, obj):
        primary_img = obj.images.filter(is_primary=True).first()
        if not primary_img:
            primary_img = obj.images.first()
        
        if primary_img and primary_img.image:
            return primary_img.image.url
        return None

    def get_average_rating(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)
        if approved_reviews.exists():
            return round(sum(r.rating for r in approved_reviews) / approved_reviews.count(), 1)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single product view"""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    materials = MaterialSerializer(many=True, read_only=True)
    specifications = SpecificationSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'description', 'product_type',
                  'base_price', 'is_price_visible', 'images', 'materials',
                  'length', 'width', 'height', 'weight', 'is_customizable',
                  'customization_note', 'stock_quantity', 'is_in_stock', 'is_low_stock',
                  'specifications', 'reviews', 'average_rating', 'review_count',
                  'is_featured', 'created_at', 'updated_at']

    def get_average_rating(self, obj):
        approved_reviews = obj.reviews.filter(is_approved=True)
        if approved_reviews.exists():
            return round(sum(r.rating for r in approved_reviews) / approved_reviews.count(), 1)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products with nested image uploads"""
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="List of image files to upload"
    )
    alt_texts = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        help_text="Alt text for each image (optional)"
    )
    primary_image_index = serializers.IntegerField(
        write_only=True,
        required=False,
        help_text="Index of image to set as primary (0-based)"
    )
    category = serializers.IntegerField(
        write_only=True,
        required=True,
        help_text="Category ID"
    )
    specifications = SpecificationSerializer(many=True, read_only=True)
    materials = MaterialSerializer(many=True, read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'category_detail', 'description', 'product_type',
                  'base_price', 'is_price_visible', 'materials', 'length', 'width',
                  'height', 'weight', 'is_customizable', 'customization_note',
                  'stock_quantity', 'low_stock_threshold', 'is_active', 'is_featured',
                  'meta_description', 'meta_keywords', 'images', 'alt_texts',
                  'primary_image_index', 'specifications', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at', 'category_detail']

    def validate_category(self, value):
        """Validate that category exists"""
        if not value:
            raise serializers.ValidationError("Category ID is required")
        
        try:
            Category.objects.get(id=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError(f"Category with ID {value} does not exist")
        except (ValueError, TypeError):
            raise serializers.ValidationError("Category ID must be a valid integer")
        
        return value

    def validate(self, data):
        """Validate the entire product data"""
        # Category is already validated, convert ID to Category instance
        if 'category' not in data:
            raise serializers.ValidationError({'category': 'Category ID is required'})
        
        category_id = data['category']
        try:
            category = Category.objects.get(id=category_id)
            data['category'] = category
        except Category.DoesNotExist:
            raise serializers.ValidationError({'category': f'Category with ID {category_id} does not exist'})
        
        return data

    def create(self, validated_data):
        # Extract images related data
        images = validated_data.pop('images', [])
        alt_texts = validated_data.pop('alt_texts', [])
        primary_image_index = validated_data.pop('primary_image_index', None)
        
        # Ensure alt_texts is a list
        if not isinstance(alt_texts, list):
            alt_texts = [alt_texts] if alt_texts else []
        
        # Check if product with same name already exists
        name = validated_data.get('name')
        from django.utils.text import slugify
        slug = slugify(name)
        
        if Product.objects.filter(slug=slug).exists():
            raise serializers.ValidationError({
                'name': f'A product with the name "{name}" already exists. Please use a different name.'
            })
        
        try:
            # Create the product
            product = Product.objects.create(**validated_data)
        except Exception as e:
            if 'slug' in str(e):
                raise serializers.ValidationError({
                    'name': 'A product with this name already exists.'
                })
            raise
        
        # Handle image uploads
        if images:
            for idx, image_file in enumerate(images):
                alt_text = alt_texts[idx] if idx < len(alt_texts) else ''
                is_primary = (idx == primary_image_index) if primary_image_index is not None else (idx == 0)
                
                # If setting as primary, remove primary from others
                if is_primary:
                    ProductImage.objects.filter(product=product, is_primary=True).update(is_primary=False)
                
                ProductImage.objects.create(
                    product=product,
                    image=image_file,
                    alt_text=alt_text,
                    is_primary=is_primary,
                    order=idx
                )
        
        return product

    def update(self, instance, validated_data):
        # Extract images related data
        images = validated_data.pop('images', None)
        alt_texts = validated_data.pop('alt_texts', [])
        primary_image_index = validated_data.pop('primary_image_index', None)
        
        # Ensure alt_texts is a list
        if not isinstance(alt_texts, list):
            alt_texts = [alt_texts] if alt_texts else []
        
        # Check if name is being changed and if new name already exists
        if 'name' in validated_data:
            new_name = validated_data['name']
            from django.utils.text import slugify
            new_slug = slugify(new_name)
            
            if Product.objects.filter(slug=new_slug).exclude(id=instance.id).exists():
                raise serializers.ValidationError({
                    'name': f'A product with the name "{new_name}" already exists. Please use a different name.'
                })
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        try:
            instance.save()
        except Exception as e:
            if 'slug' in str(e):
                raise serializers.ValidationError({
                    'name': 'A product with this name already exists.'
                })
            raise
        
        # Handle image uploads (add new images to existing ones)
        if images:
            # Get current max order
            max_order = instance.images.aggregate(models.Max('order'))['order__max'] or -1
            
            for idx, image_file in enumerate(images):
                alt_text = alt_texts[idx] if idx < len(alt_texts) else ''
                is_primary = (idx == primary_image_index) if primary_image_index is not None else False
                
                if is_primary:
                    ProductImage.objects.filter(product=instance, is_primary=True).update(is_primary=False)
                
                ProductImage.objects.create(
                    product=instance,
                    image=image_file,
                    alt_text=alt_text,
                    is_primary=is_primary,
                    order=max_order + idx + 1
                )
        
        return instance


class QuotationAttachmentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = QuotationAttachment
        fields = ['id', 'file', 'file_name', 'description', 'uploaded_at']


class QuotationRequestSerializer(serializers.ModelSerializer):
    attachments = QuotationAttachmentSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True, allow_null=True)
    product_name = serializers.CharField(source='product.name', read_only=True, allow_null=True)
    upload_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = QuotationRequest
        fields = [
            'id', 'user_name', 'product', 'product_name', 'quote_type',
            'guest_name', 'guest_email', 'guest_phone', 'project_title',
            'service_type', 'description', 'quantity', 'urgency', 'custom_dimensions',
            'preferred_materials', 'additional_requirements', 'budget_range_min',
            'budget_range_max', 'required_by', 'status', 'quoted_price',
            'quoted_delivery_time', 'admin_notes', 'quote_valid_until',
            'attachments', 'upload_files', 'created_at', 'updated_at', 'quoted_at'
        ]
        read_only_fields = ['user_name', 'status', 'quoted_price', 'quoted_delivery_time',
                            'admin_notes', 'quote_valid_until', 'quoted_at']

    def validate(self, data):
        # Check if user is authenticated or guest info is provided
        request = self.context.get('request')
        
        if not request or not request.user.is_authenticated:
            # Guest user - require contact info
            if not data.get('guest_name'):
                raise serializers.ValidationError({"guest_name": "Name is required for guest users"})
            if not data.get('guest_email'):
                raise serializers.ValidationError({"guest_email": "Email is required for guest users"})
            if not data.get('guest_phone'):
                raise serializers.ValidationError({"guest_phone": "Phone is required for guest users"})
        
        return data

    def create(self, validated_data):
        upload_files = validated_data.pop('upload_files', [])
        request = self.context.get('request')
        
        # Set user if authenticated
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        quotation = QuotationRequest.objects.create(**validated_data)
        
        # Handle file uploads
        for file in upload_files:
            QuotationAttachment.objects.create(
                quotation=quotation,
                file=file,
                file_name=file.name
            )
        
        return quotation


class ServiceBookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    service_address_details = serializers.SerializerMethodField()

    class Meta:
        model = ServiceBooking
        fields = [
            'id', 'user_name', 'product', 'product_name', 'service_type',
            'description', 'preferred_date', 'preferred_time', 'confirmed_date',
            'confirmed_time', 'service_address', 'service_address_details',
            'status', 'admin_notes', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['user_name', 'confirmed_date', 'confirmed_time',
                            'status', 'admin_notes', 'completed_at']

    def get_service_address_details(self, obj):
        if obj.service_address:
            return {
                'street_address': obj.service_address.street_address,
                'city': obj.service_address.city,
                'state': obj.service_address.state,
                'country': obj.service_address.country,
                'zip_code': obj.service_address.zip_code,
            }
        return None

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)