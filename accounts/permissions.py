from rest_framework.permissions import BasePermission

class IsAdminOrOwner(BasePermission):
    """
    Admin → Full access
    User  → Only access their own objects
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if getattr(request.user, "is_admin", False):
            return True
        return hasattr(obj, "owner") and obj.owner == request.user
