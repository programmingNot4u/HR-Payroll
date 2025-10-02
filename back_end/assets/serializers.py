from rest_framework import serializers
from .models import Asset, AssetAssignment, AssetMaintenance, AssetReturn
from employees.serializers import EmployeeListSerializer
from employees.models import Employee


class AssetSerializer(serializers.ModelSerializer):
    """Serializer for Asset model"""
    
    # Computed fields
    total_value = serializers.ReadOnlyField()
    is_assigned = serializers.ReadOnlyField()
    
    # Related fields for assignment history
    assignment_history = serializers.SerializerMethodField()
    maintenance_history = serializers.SerializerMethodField()
    
    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'model', 'category', 'department', 'status',
            'quantity', 'value', 'total_value', 'purchase_date', 'depreciation_rate',
            'vendor', 'acc_voucher', 'warranty_period',
            'assigned_to', 'assigned_to_id', 'assignment_date', 'expected_return_date',
            'assignment_reason', 'assigned_by', 'assignment_notes', 'assigned_condition',
            'return_date', 'return_condition', 'return_reason', 'returned_by',
            'return_notes', 'return_processed_date', 'disposal_date',
            'created_at', 'updated_at', 'is_assigned',
            'assignment_history', 'maintenance_history'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_assignment_history(self, obj):
        """Get assignment history for the asset"""
        assignments = obj.assignment_history.all()
        return AssetAssignmentSerializer(assignments, many=True).data
    
    def get_maintenance_history(self, obj):
        """Get maintenance history for the asset"""
        maintenance = obj.maintenance_history.all()
        return AssetMaintenanceSerializer(maintenance, many=True).data


class AssetListSerializer(serializers.ModelSerializer):
    """Simplified serializer for asset lists"""
    
    is_assigned = serializers.ReadOnlyField()
    
    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'model', 'category', 'department', 'status',
            'value', 'purchase_date', 'depreciation_rate',
            'vendor', 'acc_voucher', 'warranty_period',
            'assigned_to', 'assigned_to_id', 'assignment_date',
            'disposal_date', 'is_assigned', 'need_maintenance'
        ]


class AssetAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for AssetAssignment model"""
    
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_id = serializers.CharField(source='asset.id', read_only=True)
    asset_value = serializers.DecimalField(source='asset.value', max_digits=12, decimal_places=2, read_only=True)
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = AssetAssignment
        fields = [
            'id', 'asset', 'asset_name', 'asset_id', 'asset_value',
            'employee_id', 'employee_name', 'assignment_date', 'expected_return_date',
            'assignment_reason', 'assigned_by', 'assigned_condition', 'assignment_notes',
            'return_date', 'return_condition', 'return_reason', 'returned_by', 'return_notes',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AssetMaintenanceSerializer(serializers.ModelSerializer):
    """Serializer for AssetMaintenance model"""
    
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_id = serializers.CharField(source='asset.id', read_only=True)
    is_completed = serializers.ReadOnlyField()
    
    class Meta:
        model = AssetMaintenance
        fields = [
            'id', 'asset', 'asset_name', 'asset_id', 'scheduled_date', 'completed_date',
            'maintenance_provider', 'status', 'description', 'cost', 'notes',
            'created_at', 'updated_at', 'is_completed'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AssetMaintenanceUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating AssetMaintenance model - allows partial updates"""
    
    scheduled_date = serializers.DateField(required=False)
    maintenance_provider = serializers.CharField(max_length=200, required=False)
    
    class Meta:
        model = AssetMaintenance
        fields = [
            'scheduled_date', 'completed_date', 'maintenance_provider', 
            'status', 'description', 'cost', 'notes'
        ]


class AssetReturnSerializer(serializers.ModelSerializer):
    """Serializer for AssetReturn model"""
    
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_id = serializers.CharField(source='asset.id', read_only=True)
    asset_value = serializers.DecimalField(source='asset.value', max_digits=12, decimal_places=2, read_only=True)
    duration = serializers.ReadOnlyField()
    
    class Meta:
        model = AssetReturn
        fields = [
            'id', 'asset', 'asset_name', 'asset_id', 'asset_value',
            'employee_id', 'employee_name', 'assigned_date', 'return_date',
            'return_condition', 'return_reason', 'received_by', 'return_notes',
            'created_at', 'updated_at', 'duration'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AssetCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating assets"""
    
    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'model', 'category', 'department', 'status',
            'value', 'purchase_date', 'depreciation_rate',
            'vendor', 'acc_voucher', 'warranty_period', 'disposal_date'
        ]
    
    def create(self, validated_data):
        """Create asset with auto-generated ID if not provided"""
        if not validated_data.get('id'):
            # Generate auto ID
            last_asset = Asset.objects.order_by('id').last()
            if last_asset:
                try:
                    last_id = int(last_asset.id)
                    new_id = str(last_id + 1)
                except ValueError:
                    new_id = '1'
            else:
                new_id = '1'
            validated_data['id'] = new_id
        
        return super().create(validated_data)


class AssetAssignmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating asset assignments"""
    
    class Meta:
        model = AssetAssignment
        fields = [
            'asset', 'employee_id', 'employee_name', 'assignment_date',
            'expected_return_date', 'assignment_reason', 'assigned_by',
            'assigned_condition', 'assignment_notes'
        ]
    
    def create(self, validated_data):
        """Create assignment and update asset status"""
        assignment = super().create(validated_data)
        
        # Update asset status and assignment info
        asset = assignment.asset
        asset.status = 'Assigned'
        asset.assigned_to = assignment.employee_name
        asset.assigned_to_id = assignment.employee_id
        asset.assignment_date = assignment.assignment_date
        asset.expected_return_date = assignment.expected_return_date
        asset.assignment_reason = assignment.assignment_reason
        asset.assigned_by = assignment.assigned_by
        asset.assignment_notes = assignment.assignment_notes
        asset.assigned_condition = assignment.assigned_condition
        asset.save()
        
        return assignment


class AssetReturnCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating asset returns"""
    
    class Meta:
        model = AssetReturn
        fields = [
            'asset', 'employee_id', 'employee_name', 'assigned_date',
            'return_date', 'return_condition', 'return_reason',
            'received_by', 'return_notes'
        ]
    
    def create(self, validated_data):
        """Create return and update asset status"""
        return_record = super().create(validated_data)
        
        # Update asset status based on return condition
        asset = return_record.asset
        
        # Determine asset status based on return condition
        # Note: Maintenance status is handled by AssetMaintenance module, not here
        if return_record.return_condition == 'Lost':
            asset.status = 'Lost'
        else:
            asset.status = 'Available'
        
        # Set need_maintenance flag based on return condition
        if return_record.return_condition == 'Need Maintenance':
            asset.need_maintenance = True
        else:
            asset.need_maintenance = False
        
        asset.assigned_to = 'Unassigned'
        asset.assigned_to_id = None
        asset.return_date = return_record.return_date
        asset.return_condition = return_record.return_condition
        asset.return_reason = return_record.return_reason
        asset.returned_by = return_record.received_by
        asset.return_notes = return_record.return_notes
        asset.return_processed_date = return_record.return_date
        asset.save()
        
        # Update the corresponding assignment record
        assignment = asset.assignment_history.filter(
            employee_id=return_record.employee_id,
            return_date__isnull=True
        ).first()
        
        if assignment:
            assignment.return_date = return_record.return_date
            assignment.return_condition = return_record.return_condition
            assignment.return_reason = return_record.return_reason
            assignment.returned_by = return_record.received_by
            assignment.return_notes = return_record.return_notes
            assignment.save()
        
        return return_record


class AssetMaintenanceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating asset maintenance records"""
    
    class Meta:
        model = AssetMaintenance
        fields = [
            'asset', 'scheduled_date', 'completed_date', 'maintenance_provider',
            'status', 'description', 'cost', 'notes'
        ]
    
    def create(self, validated_data):
        """Create maintenance record and update asset status"""
        maintenance = super().create(validated_data)
        
        # Update asset status to Maintenance
        asset = maintenance.asset
        asset.status = 'Maintenance'
        asset.save()
        
        return maintenance


class AssetMaintenanceUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating AssetMaintenance model - allows partial updates"""
    
    scheduled_date = serializers.DateField(required=False)  # Made optional
    maintenance_provider = serializers.CharField(max_length=200, required=False)  # Made optional
    
    class Meta:
        model = AssetMaintenance
        fields = [
            'scheduled_date', 'completed_date', 'maintenance_provider', 
            'status', 'description', 'cost', 'notes'
        ]
    
    def update(self, instance, validated_data):
        """Update maintenance record and handle asset status changes"""
        maintenance = super().update(instance, validated_data)
        
        # Update asset status and need_maintenance flag based on maintenance status
        asset = maintenance.asset
        
        if maintenance.status == 'Complete':
            # Maintenance completed - set asset back to Available and clear need_maintenance
            asset.status = 'Available'
            asset.need_maintenance = False
        elif maintenance.status == 'Ongoing':
            # Maintenance in progress - keep status as Maintenance
            asset.status = 'Maintenance'
        else:
            # Pending maintenance - keep status as Maintenance
            asset.status = 'Maintenance'
        
        asset.save()
        
        return maintenance
