from django.contrib import admin
from .models import Project, ProjectAssignment, ProjectPayment

class ProjectAssignmentInline(admin.TabularInline):
    model = ProjectAssignment
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client_name', 'status', 'deadline', 'total_budget')
    list_filter = ('status', 'deadline')
    search_fields = ('title', 'client_name')
    inlines = [ProjectAssignmentInline]

@admin.register(ProjectAssignment)
class ProjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ('project', 'staff', 'role_in_project', 'performance_rating')
    list_filter = ('project', 'staff')

@admin.register(ProjectPayment)
class ProjectPaymentAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'amount', 'payment_date', 'description', 'is_confirmed')
    list_filter = ('payment_date', 'is_confirmed')
