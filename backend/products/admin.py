from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category, Material, Product, ProductImage, Specification,
    Review, QuotationRequest, QuotationAttachment, ServiceBooking
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'is_primary', 'order')


class SpecificationInline(admin.TabularInline):
    model = Specification
    extra = 1
    fields = ('name', 'value', 'order')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'product_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'product_type', 'base_price', 'stock_quantity', 
                    'is_active', 'is_featured', 'stock_status']
    list_filter = ['category', 'product_type', 'is_active', 'is_featured', 'is_customizable']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['materials']
    inlines = [ProductImageInline, SpecificationInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'description', 'product_type')
        }),
        ('Pricing', {
            'fields': ('base_price', 'is_price_visible')
        }),
        ('Materials & Dimensions', {
            'fields': ('materials', 'length', 'width', 'height', 'weight')
        }),
        ('Customization', {
            'fields': ('is_customizable', 'customization_note')
        }),
        ('Inventory', {
            'fields': ('stock_quantity', 'low_stock_threshold')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )
    
    def stock_status(self, obj):
        if obj.stock_quantity == 0:
            color = 'red'
            text = 'Out of Stock'
        elif obj.is_low_stock:
            color = 'orange'
            text = 'Low Stock'
        else:
            color = 'green'
            text = 'In Stock'
        return format_html('<span style="color: {};">{}</span>', color, text)
    stock_status.short_description = 'Stock Status'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image_preview', 'is_primary', 'order']
    list_filter = ['is_primary', 'product__category']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return '-'
    image_preview.short_description = 'Preview'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'is_approved', 'is_verified_purchase', 'created_at']
    list_filter = ['rating', 'is_approved', 'is_verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__username', 'comment']
    actions = ['approve_reviews', 'reject_reviews']
    
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = 'Approve selected reviews'
    
    def reject_reviews(self, request, queryset):
        queryset.update(is_approved=False)
    reject_reviews.short_description = 'Reject selected reviews'


class QuotationAttachmentInline(admin.TabularInline):
    model = QuotationAttachment
    extra = 0
    fields = ('file', 'file_name', 'description')
    readonly_fields = ('uploaded_at',)


@admin.register(QuotationRequest)
class QuotationRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_customer_info', 'quote_type', 'service_type', 
                    'project_title', 'quantity', 'status', 'urgency', 'created_at']
    list_filter = ['status', 'quote_type', 'urgency', 'service_type', 'created_at']
    search_fields = ['project_title', 'description', 'user__username', 'user__email',
                     'guest_name', 'guest_email', 'guest_phone']
    inlines = [QuotationAttachmentInline]
    readonly_fields = ('created_at', 'updated_at', 'quoted_at')
    
    fieldsets = (
        ('Quote Type', {
            'fields': ('quote_type',)
        }),
        ('Customer Information', {
            'fields': ('user', 'guest_name', 'guest_email', 'guest_phone'),
            'description': 'Either user account OR guest information will be filled'
        }),
        ('Product Reference', {
            'fields': ('product',),
            'classes': ('collapse',)
        }),
        ('Project Details', {
            'fields': ('project_title', 'service_type', 'description', 'quantity', 
                      'urgency', 'custom_dimensions', 'preferred_materials', 
                      'additional_requirements')
        }),
        ('Budget & Timeline', {
            'fields': ('budget_range_min', 'budget_range_max', 'required_by')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Quote Information (Admin)', {
            'fields': ('quoted_price', 'quoted_delivery_time', 'admin_notes', 
                      'quote_valid_until', 'quoted_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_customer_info(self, obj):
        if obj.user:
            return format_html(
                '<strong>{}</strong><br/><small>Registered User</small>',
                obj.user.get_full_name() or obj.user.username
            )
        return format_html(
            '<strong>{}</strong><br/><small>Guest</small><br/>📧 {}<br/>📱 {}',
            obj.guest_name,
            obj.guest_email,
            obj.guest_phone
        )
    get_customer_info.short_description = 'Customer'
    
    def save_model(self, request, obj, form, change):
        if change and 'status' in form.changed_data and obj.status == 'quoted':
            from django.utils import timezone
            obj.quoted_at = timezone.now()
        super().save_model(request, obj, form, change)
    
    actions = ['mark_as_reviewing', 'mark_as_quoted']
    
    def mark_as_reviewing(self, request, queryset):
        queryset.update(status='reviewing')
    mark_as_reviewing.short_description = 'Mark as Under Review'
    
    def mark_as_quoted(self, request, queryset):
        from django.utils import timezone
        for quote in queryset:
            quote.status = 'quoted'
            quote.quoted_at = timezone.now()
            quote.save()
    mark_as_quoted.short_description = 'Mark as Quoted'


@admin.register(ServiceBooking)
class ServiceBookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'service_type', 'preferred_date', 
                    'status', 'created_at']
    list_filter = ['status', 'preferred_date', 'created_at']
    search_fields = ['user__username', 'product__name', 'service_type', 'description']
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('user', 'product', 'service_address')
        }),
        ('Service Details', {
            'fields': ('service_type', 'description')
        }),
        ('Scheduling', {
            'fields': ('preferred_date', 'preferred_time', 'confirmed_date', 'confirmed_time')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'completed_at')