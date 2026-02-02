from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class Category(models.Model):
    """Product/Service categories"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Material(models.Model):
    """Materials used in fabrication"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='materials/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Product(models.Model):
    """Products available for purchase or quotation"""
    PRODUCT_TYPE_CHOICES = [
        ('standard', 'Standard Product'),
        ('custom', 'Custom Product'),
        ('service', 'Service'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    description = models.TextField()
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, default='standard')
    
    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_price_visible = models.BooleanField(default=True, help_text="Show price or 'Request Quote'")
    
    # Materials
    materials = models.ManyToManyField(Material, related_name='products', blank=True)
    
    # Dimensions (optional for standard products)
    length = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="in meters")
    width = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="in meters")
    height = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="in meters")
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="in kg")
    
    # Customization
    is_customizable = models.BooleanField(default=False)
    customization_note = models.TextField(blank=True, help_text="Instructions for customization")
    
    # Inventory
    stock_quantity = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=5)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=200, blank=True)
    focus_keyword = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'is_active']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0

    @property
    def is_low_stock(self):
        return 0 < self.stock_quantity <= self.low_stock_threshold

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """Multiple images for each product"""
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary']

    def save(self, *args, **kwargs):
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class Specification(models.Model):
    """Technical specifications for products"""
    product = models.ForeignKey(Product, related_name='specifications', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=200)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        # Ensure no duplicate specification names per product
        unique_together = [['product', 'name']]
        indexes = [
            models.Index(fields=['product', 'name']),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.name}: {self.value}"


class Review(models.Model):
    """Product reviews"""
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='product_reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['product', 'user']

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}★)"


class QuotationRequest(models.Model):
    """Customer quotation requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('quoted', 'Quote Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed/Fulfilled'),
        ('expired', 'Expired'),
    ]

    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    QUOTE_TYPE_CHOICES = [
        ('instant', 'Instant Quote'),
        ('production', 'Production Quote'),
    ]

    # Customer Info
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='quotation_requests', on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, related_name='quotation_requests', on_delete=models.CASCADE, null=True, blank=True)
    service = models.ForeignKey('StoreService', related_name='quotation_requests', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Quote Type
    quote_type = models.CharField(max_length=20, choices=QUOTE_TYPE_CHOICES, default='instant')
    
    # Guest Contact Info (for non-logged in users)
    guest_name = models.CharField(max_length=200, blank=True)
    guest_email = models.EmailField(blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)
    
    # Project Details
    project_title = models.CharField(max_length=200)
    service_type = models.CharField(max_length=200, blank=True, help_text="Service category selected")
    description = models.TextField(help_text="Detailed description of requirements")
    quantity = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium')
    
    # Custom Specifications
    custom_dimensions = models.TextField(blank=True, help_text="Custom size requirements")
    preferred_materials = models.TextField(blank=True)
    additional_requirements = models.TextField(blank=True)
    
    # Budget
    budget_range_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_range_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Timeline
    required_by = models.DateField(null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Quote Details (filled by admin)
    quoted_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    final_adjusted_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Final price after negotiation/fulfillment")
    quoted_delivery_time = models.CharField(max_length=100, blank=True)
    admin_notes = models.TextField(blank=True)
    quote_valid_until = models.DateField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    quoted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Quote #{self.id} - {self.user.username if self.user else self.guest_name} - {self.status}"


class QuotationAttachment(models.Model):
    """Attachments for quotation requests (reference images, drawings, etc.)"""
    quotation = models.ForeignKey(QuotationRequest, related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='quotations/')
    file_name = models.CharField(max_length=200)
    description = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quotation.project_title} - {self.file_name}"


class ServiceBooking(models.Model):
    """Service booking for installation, maintenance, etc."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='service_bookings', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='service_bookings', on_delete=models.CASCADE)
    
    # Service Details
    service_type = models.CharField(max_length=100, help_text="e.g., Installation, Maintenance, Repair")
    description = models.TextField()
    
    # Scheduling
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    confirmed_date = models.DateField(null=True, blank=True)
    confirmed_time = models.TimeField(null=True, blank=True)
    
    # Location
    service_address = models.ForeignKey('accounts.Address', on_delete=models.SET_NULL, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username} - {self.service_type}"


class StoreService(models.Model):
    """Dynamic services offered by the company"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    category = models.CharField(max_length=100, help_text="e.g., Construction, Fabrication, Furniture")
    description = models.TextField()
    icon_name = models.CharField(max_length=50, help_text="React icon name to use", blank=True)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=200, blank=True)
    focus_keyword = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class StoreServiceImage(models.Model):
    """Multiple images for each service"""
    service = models.ForeignKey(StoreService, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='services/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary']
    
    def __str__(self):
        return f"{self.service.title} - Image {self.order}"


class SearchQuery(models.Model):
    """Tracking user search behavior for analytics"""
    query = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    count = models.PositiveIntegerField(default=1)
    last_searched = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Search Queries"
        ordering = ['-last_searched']

    def __str__(self):
        return f"{self.query} ({self.count})"


class ProductView(models.Model):
    """Tracking product views for analytics"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"View of {self.product.name} at {self.viewed_at}"
