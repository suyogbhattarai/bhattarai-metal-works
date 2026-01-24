# ============================================================
# FILE 1: serializers.py
# ============================================================

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        exclude = ['user']

    def validate(self, attrs):
        # Ensure only one default shipping per user
        request_user = self.context['request'].user

        if attrs.get('is_default_shipping'):
            Address.objects.filter(user=request_user, is_default_shipping=True).update(is_default_shipping=False)

        if attrs.get('is_default_billing'):
            Address.objects.filter(user=request_user, is_default_billing=True).update(is_default_billing=False)

        return attrs


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = (
            'username', 'email', 'password', 'password2', 'first_name', 
            'last_name', 'phone_number', 'profile_picture'
        )
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
            'profile_picture': {'required': False},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)
    email = serializers.EmailField(required=False)
    # Add role information fields
    is_admin = serializers.SerializerMethodField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'profile_picture',
            'last_login',
            'date_joined',
            'is_admin',
            'is_staff',
            'role',
            'addresses'
        )
        read_only_fields = ('username', 'last_login', 'date_joined', 'is_staff')

    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture:
            url = obj.profile_picture.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_is_admin(self, obj):
        """Check if user is a superuser/admin"""
        return obj.is_superuser

    def get_role(self, obj):
        """Return user role as a string for easy frontend usage"""
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'staff'
        else:
            return 'user'

    def validate_email(self, value):
        user = self.instance
        if CustomUser.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        request = self.context.get('request')

        # Handle profile picture
        if request and request.FILES.get('profile_picture'):
            instance.profile_picture = request.FILES['profile_picture']

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


# ============================================================
# ADMIN SERIALIZERS
# ============================================================

class AdminUserListSerializer(serializers.ModelSerializer):
    """Serializer for admin to view all users with minimal sensitive info"""
    role = serializers.SerializerMethodField(read_only=True)
    addresses_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'is_active',
            'is_staff',
            'is_superuser',
            'role',
            'date_joined',
            'last_login',
            'addresses_count',
        )
        read_only_fields = fields

    def get_role(self, obj):
        """Return user role as a string"""
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'staff'
        else:
            return 'user'
    
    def get_addresses_count(self, obj):
        """Return count of user addresses"""
        return obj.addresses.count()


class AdminUserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for admin to view/update individual user"""
    role = serializers.SerializerMethodField(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'profile_picture',
            'is_active',
            'is_staff',
            'is_superuser',
            'role',
            'date_joined',
            'last_login',
            'addresses',
        )
        read_only_fields = ('id', 'username', 'date_joined', 'last_login', 'addresses')

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'staff'
        else:
            return 'user'

    def update(self, instance, validated_data):
        """Update user while preventing role downgrade of self"""
        request = self.context.get('request')
        
        # Prevent users from downgrading their own admin status
        if request and request.user == instance:
            if 'is_superuser' in validated_data and not validated_data['is_superuser']:
                raise serializers.ValidationError("You cannot remove your own admin status.")
            if 'is_staff' in validated_data and not validated_data['is_staff'] and instance.is_staff:
                raise serializers.ValidationError("You cannot remove your own staff status.")
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class AdminUserRoleChangeSerializer(serializers.Serializer):
    """Serializer for changing user roles"""
    role = serializers.ChoiceField(choices=['user', 'staff', 'admin'])
    
    def validate(self, data):
        request = self.context.get('request')
        user = self.context.get('user')
        
        if request and request.user == user:
            if data['role'] == 'user':
                raise serializers.ValidationError("You cannot downgrade your own role.")
        
        return data


class BulkUserActionSerializer(serializers.Serializer):
    """Serializer for bulk user actions"""
    user_ids = serializers.ListField(child=serializers.IntegerField())
    action = serializers.ChoiceField(choices=['activate', 'deactivate', 'delete'])
    
    def validate_user_ids(self, value):
        if not value:
            raise serializers.ValidationError("At least one user ID is required.")
        if len(value) > 100:
            raise serializers.ValidationError("Cannot perform bulk action on more than 100 users at once.")
        return value