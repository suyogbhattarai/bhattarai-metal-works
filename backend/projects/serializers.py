from rest_framework import serializers
from .models import Project, ProjectAssignment, ProjectPayment

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectAssignmentSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.user.get_full_name')
    project_title = serializers.ReadOnlyField(source='project.title')
    
    class Meta:
        model = ProjectAssignment
        fields = '__all__'

class ProjectPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectPayment
        fields = '__all__'
