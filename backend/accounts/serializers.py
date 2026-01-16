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
            'addresses'
        )
        read_only_fields = ('username', 'last_login', 'date_joined')

    def get_profile_picture(self, obj):
        request = self.context.get('request')
        if obj.profile_picture:
            url = obj.profile_picture.url
            return request.build_absolute_uri(url) if request else url
        return None

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
