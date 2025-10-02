from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms

# Get the custom User model
User = get_user_model()

# --- Custom Form to handle the missing 'username' field ---

class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required fields."""
    class Meta:
        model = User
        # The fields needed for a new user, excluding 'username'
        fields = ('email', 'first_name', 'last_name', 'role', 'phone')

    # Django Admin expects a 'password' field in the creation form
    # We will set a temporary, unusable password and instruct the Admin to hash it.
    password = forms.CharField(widget=forms.PasswordInput, label="Password (must be set)")

    def save(self, commit=True):
        # Save the new user and set the password correctly
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


# --- Custom Admin Class for the User Model ---

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom UserAdmin class to manage the custom User model.
    """
    # Use the custom form for creating new users
    add_form = UserCreationForm
    
    # Custom fieldsets for editing an existing user
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Permissions & Roles', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )

    # Custom fieldsets for adding a new user (uses the 'add_form' but needs definition here)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'role', 'phone', 'is_staff', 'is_superuser')
        }),
    )

    # Fields to display in the list view
    list_display = ('email', 'full_name', 'role', 'is_staff', 'is_active', 'created_at')
    
    # Fields to link to the detail view
    list_display_links = ('email', 'full_name')

    # Fields for filtering the list
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'role')

    # Fields for searching
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    
    # Fields that are read-only
    readonly_fields = ('last_login', 'date_joined', 'created_at', 'updated_at')
    
    # Order the list by
    ordering = ('-created_at',)

    # Replace the default 'username' with 'email' in the form
    # Note: The BaseUserAdmin expects USERNAME_FIELD to be in this tuple
    # We must explicitly exclude the old 'username' field.
    # We are using fieldsets above instead of this to control the layout better.
    
    # This prevents the creation form from complaining about missing 'username'
    def get_form(self, request, obj=None, **kwargs):
        defaults = {}
        if obj is None:
            defaults['form'] = self.add_form
        return super().get_form(request, obj, **kwargs)

    # This removes the 'username' from the display on the change form
    # The actual removal is handled by `fieldsets` above.
    # We explicitly remove the `username` field for consistency.
    def get_fieldsets(self, request, obj=None):
        if obj:
            # Change view
            return self.fieldsets
        # Add view
        return self.add_fieldsets

# Optional: Unregister the default User model if it was auto-registered
# try:
#     admin.site.unregister(User)
# except admin.sites.NotRegistered:
#     pass

# The @admin.register(User) decorator handles the final registration.