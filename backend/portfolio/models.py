from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator

class PortfolioCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Portfolio Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class PortfolioProject(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(PortfolioCategory, related_name='projects', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    client_name = models.CharField(max_length=255, blank=True)
    client_logo = models.ImageField(upload_to='portfolio/clients/', null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    completion_date = models.DateField(null=True, blank=True)
    
    # Showcase features
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # SEO fields
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-completion_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class PortfolioProjectImage(models.Model):
    project = models.ForeignKey(PortfolioProject, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='portfolio/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-is_primary']

    def save(self, *args, **kwargs):
        if self.is_primary:
            PortfolioProjectImage.objects.filter(project=self.project, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.project.title}"
