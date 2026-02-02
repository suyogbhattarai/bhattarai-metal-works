from django.contrib import admin
from .models import StaffProfile, Attendance, Payroll

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'staff_type', 'designation', 'base_salary', 'is_active')
    list_filter = ('staff_type', 'is_active')
    search_fields = ('user__username', 'user__email', 'designation')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('staff', 'date', 'clock_in', 'clock_out', 'status')
    list_filter = ('date', 'status')
    search_fields = ('staff__user__username',)

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('staff', 'month', 'year', 'total_paid', 'is_paid', 'payment_date')
    list_filter = ('year', 'month', 'is_paid')
    search_fields = ('staff__user__username',)
