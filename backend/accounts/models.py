from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# Function to define the default profile picture path if one isn't uploaded
def default_profile_picture():
    # Ensure you have a 'media/profile_pictures/default_avatar.jpeg' file
    return "profile_pictures/default_avatar.jpg" 

class CustomUser(AbstractUser):
    """
    Custom User model with basic e-commerce info.
    """
    phone_number = models.CharField(max_length=15, blank=True, null=True, help_text="User's contact phone number")
    
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', 
        default=default_profile_picture,
        blank=True, 
        null=True,
        help_text="User's profile image"
    )

    # These related_name arguments are necessary to avoid clashes with the default User model
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    def __str__(self):
        return self.email or self.username


class Address(models.Model):
    """
    Model to store multiple addresses per user (shipping or billing).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='addresses', on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    
    is_default_shipping = models.BooleanField(default=False)
    is_default_billing = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return f'{self.user.username} Address: {self.street_address}, {self.city}'

