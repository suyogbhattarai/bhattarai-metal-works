from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class StaffProfile(models.Model):
    STAFF_TYPE_CHOICES = [
        ('full_time', 'Full Time Employee'),
        ('freelancer', 'Freelancer / Project-based'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff_profile')
    staff_type = models.CharField(max_length=20, choices=STAFF_TYPE_CHOICES, default='full_time')
    designation = models.CharField(max_length=100, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    
    # Personal & Official Info
    phone_number = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=20, blank=True)
    citizenship_number = models.CharField(max_length=50, blank=True)
    pan_number = models.CharField(max_length=50, blank=True)
    insurance_policy_number = models.CharField(max_length=100, blank=True)
    
    # Financials
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, help_text="Monthly salary for full-time or rate for freelancers", default=0)
    
    # Documents
    citizenship_front = models.ImageField(upload_to='staff/docs/', blank=True, null=True)
    citizenship_back = models.ImageField(upload_to='staff/docs/', blank=True, null=True)
    insurance_doc = models.FileField(upload_to='staff/docs/', blank=True, null=True)
    contract_doc = models.FileField(upload_to='staff/docs/', blank=True, null=True)
    profile_picture = models.ImageField(upload_to='staff/profiles/', blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.get_staff_type_display()}"

class Attendance(models.Model):
    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(auto_now_add=True)
    clock_in = models.TimeField()
    clock_out = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('present', 'Present'), ('absent', 'Absent'), ('leave', 'Leave')], default='present')
    remark = models.TextField(blank=True)

    class Meta:
        unique_together = ['staff', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.staff.user.username} - {self.date}"

class Payroll(models.Model):
    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='payrolls')
    month = models.IntegerField(validators=[MinValueValidator(1)])
    year = models.IntegerField()
    calculated_salary = models.DecimalField(max_digits=10, decimal_places=2)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, default='Bank Transfer')
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.staff.user.username} - {self.month}/{self.year}"
