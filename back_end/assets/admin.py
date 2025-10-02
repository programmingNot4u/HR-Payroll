from django.contrib import admin
from .models import Asset, AssetAssignment, AssetMaintenance, AssetReturn


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'category', 'department', 'status', 
        'assigned_to', 'value', 'purchase_date', 'created_at'
    ]
    list_filter = ['status', 'category', 'department', 'created_at']
    search_fields = ['id', 'name', 'model', 'assigned_to', 'assigned_to_id']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['id']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'model', 'category', 'department', 'status')
        }),
        ('Value & Quantity', {
            'fields': ('quantity', 'value', 'depreciation_rate')
        }),
        ('Purchase Information', {
            'fields': ('purchase_date', 'vendor', 'acc_voucher', 'warranty_period')
        }),
        ('Current Assignment', {
            'fields': (
                'assigned_to', 'assigned_to_id', 'assignment_date', 
                'expected_return_date', 'assignment_reason', 'assigned_by', 
                'assignment_notes', 'assigned_condition'
            )
        }),
        ('Return Information', {
            'fields': (
                'return_date', 'return_condition', 'return_reason', 
                'returned_by', 'return_notes', 'return_processed_date'
            )
        }),
        ('Disposal', {
            'fields': ('disposal_date',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AssetAssignment)
class AssetAssignmentAdmin(admin.ModelAdmin):
    list_display = [
        'asset', 'employee_name', 'employee_id', 'assignment_date', 
        'return_date', 'assigned_condition', 'created_at'
    ]
    list_filter = ['assigned_condition', 'assignment_date', 'created_at']
    search_fields = ['asset__name', 'employee_name', 'employee_id']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-assignment_date']
    
    fieldsets = (
        ('Assignment Details', {
            'fields': (
                'asset', 'employee_id', 'employee_name', 'assignment_date', 
                'expected_return_date', 'assignment_reason', 'assigned_by', 
                'assigned_condition', 'assignment_notes'
            )
        }),
        ('Return Information', {
            'fields': (
                'return_date', 'return_condition', 'return_reason', 
                'returned_by', 'return_notes'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AssetMaintenance)
class AssetMaintenanceAdmin(admin.ModelAdmin):
    list_display = [
        'asset', 'maintenance_provider', 'scheduled_date', 
        'completed_date', 'status', 'created_at'
    ]
    list_filter = ['status', 'scheduled_date', 'created_at']
    search_fields = ['asset__name', 'maintenance_provider']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-scheduled_date']
    
    fieldsets = (
        ('Maintenance Details', {
            'fields': (
                'asset', 'scheduled_date', 'completed_date', 
                'maintenance_provider', 'status', 'description', 'cost', 'notes'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AssetReturn)
class AssetReturnAdmin(admin.ModelAdmin):
    list_display = [
        'asset', 'employee_name', 'employee_id', 'assigned_date', 
        'return_date', 'return_condition', 'received_by', 'created_at'
    ]
    list_filter = ['return_condition', 'return_date', 'created_at']
    search_fields = ['asset__name', 'employee_name', 'employee_id', 'received_by']
    readonly_fields = ['created_at', 'updated_at', 'duration']
    ordering = ['-return_date']
    
    fieldsets = (
        ('Return Details', {
            'fields': (
                'asset', 'employee_id', 'employee_name', 'assigned_date', 
                'return_date', 'return_condition', 'return_reason', 
                'received_by', 'return_notes'
            )
        }),
        ('Calculated Fields', {
            'fields': ('duration',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )