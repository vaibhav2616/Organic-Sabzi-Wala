from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import OrderService


class IsStaffOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class PickerUpdateView(APIView):
    """
    Warehouse picker updates the actual weight of items.
    Delegates to OrderService which handles local + external sync.
    """
    permission_classes = [IsStaffOrAdmin]

    def patch(self, request, order_id):
        data = request.data
        product_id = data.get('product_id')
        actual_weight = data.get('weight')

        if not product_id or not actual_weight:
            return Response(
                {'error': 'Product ID and Weight required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        service = OrderService()
        success, message = service.update_item_weight(order_id, product_id, actual_weight)

        if success:
            return Response({'success': True, 'message': message})
        else:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
