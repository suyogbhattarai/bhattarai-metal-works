from django.db import models
from django.core.validators import MinValueValidator
from hr.models import StaffProfile

class Project(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    client_name = models.CharField(max_length=255)
    start_date = models.DateField()
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    total_budget = models.DecimalField(max_digits=12, decimal_places=2)
    is_private = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ProjectAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assignments')
    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='project_assignments')
    role_in_project = models.CharField(max_length=100)
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    # For freelancers specifically, though could apply to FT too as bonus
    agreed_payment = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Total agreed payment for this project")
    
    performance_rating = models.IntegerField(null=True, blank=True, help_text="1-10 rating after completion")
    performance_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.staff.user.username} assigned to {self.project.title}"

class ProjectPayment(models.Model):
    assignment = models.ForeignKey(ProjectAssignment, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    description = models.CharField(max_length=255, help_text="e.g., Advance, Phase 1 Completion, Final Payment")
    is_confirmed = models.BooleanField(default=True)

    def __str__(self):
        return f"Payment of {self.amount} to {self.assignment.staff.user.username} for {self.assignment.project.title}"
