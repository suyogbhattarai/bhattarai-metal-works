from rest_framework import serializers
from .models import StaffProfile, Attendance, Payroll
from django.contrib.auth import get_user_model

User = get_user_model()

class UserStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'validators': []}, # Handled manually in Views/Serializers
            'email': {'validators': []}
        }

class StaffProfileSerializer(serializers.ModelSerializer):
    user_details = UserStaffSerializer(source='user', read_only=True)
    
    class Meta:
        model = StaffProfile
        fields = '__all__'

class StaffCreateSerializer(serializers.ModelSerializer):
    user_data = UserStaffSerializer(source='user')

    class Meta:
        model = StaffProfile
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}

    def to_internal_value(self, data):
        # Handle flattened keys from multipart/form-data (e.g. user_data.username)
        if hasattr(data, 'getlist'): # It's a QueryDict
            new_data = data.copy()
            user_data = {}
            for key in data.keys():
                if key.startswith('user_data.'):
                    sub_key = key.split('.', 1)[1]
                    user_data[sub_key] = data.get(key)
            if user_data:
                new_data['user_data'] = user_data
            data = new_data
        return super().to_internal_value(data)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = user_data.pop('password', 'Staff@123')
        user = User.objects.create_user(**user_data, password=password)
        user.is_staff = True
        user.save()
        
        staff_profile = StaffProfile.objects.create(user=user, **validated_data)
        return staff_profile

    def validate(self, attrs):
        # Manual unique check for username/email since we disabled validators on nested serializer
        if 'user' in attrs:
            user_data = attrs['user']
            username = user_data.get('username')
            email = user_data.get('email')
            
            if username:
                if User.objects.filter(username=username).exists():
                    raise serializers.ValidationError({'user_data': {'username': ['A user with that username already exists.']}})
            
            if email:
                if User.objects.filter(email=email).exists():
                    raise serializers.ValidationError({'user_data': {'email': ['A user with that email already exists.']}})
        
        return attrs

class StaffUpdateSerializer(StaffCreateSerializer):
    def validate(self, attrs):
        # Manual unique check excluding current user
        if 'user' in attrs:
            user_data = attrs['user']
            username = user_data.get('username')
            email = user_data.get('email')
            current_user = self.instance.user if self.instance else None
            
            if current_user:
                if username and username != current_user.username:
                    if User.objects.filter(username=username).exists():
                         raise serializers.ValidationError({'user_data': {'username': ['A user with that username already exists.']}})
                
                if email and email != current_user.email:
                    if User.objects.filter(email=email).exists():
                         raise serializers.ValidationError({'user_data': {'email': ['A user with that email already exists.']}})
        return attrs

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        for attr, value in user_data.items():
            if attr == 'password' and value:
                user.set_password(value)
            else:
                setattr(user, attr, value)
        user.save()
        
        return super(StaffCreateSerializer, self).update(instance, validated_data)

class AttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.user.get_full_name')
    
    class Meta:
        model = Attendance
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.user.get_full_name')
    
    class Meta:
        model = Payroll
        fields = '__all__'
