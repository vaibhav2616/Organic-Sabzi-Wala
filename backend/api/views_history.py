from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer
from .renderers import StandardResponseRenderer

class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [StandardResponseRenderer]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
