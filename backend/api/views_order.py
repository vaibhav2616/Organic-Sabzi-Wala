from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Order
from .serializers import OrderSerializer
from .renderers import StandardResponseRenderer
from .services import OrderService

import uuid


class PlaceOrderView(APIView):
    renderer_classes = [StandardResponseRenderer]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        service = OrderService()
        order, error = service.place_order(request.user, request.data)

        if error:
            http_status = error.pop('status', 400)
            return Response(error, status=http_status)

        if order and 'payment_data' not in (error or {}):
            return Response({
                'success': True,
                'user_msg': 'Order Placed Successfully!',
                'order_id': str(order.id),
            })

        # Razorpay case — error dict contains payment_data
        if error and 'payment_data' in error:
            return Response(error)

        return Response({
            'success': True,
            'user_msg': 'Order Placed Successfully!',
            'order_id': str(order.id),
        })


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class PaymentWebhookView(APIView):
    """Simulates Razorpay Success Callback"""
    renderer_classes = [StandardResponseRenderer]
    
    def post(self, request):
        order_id = request.data.get('order_id')
        payment_id = request.data.get('payment_id')
        
        try:
            order = Order.objects.get(id=order_id)
            order.transaction_id = payment_id
            order.payment_status = 'COMPLETED'
            order.save()
            return Response({'success': True, 'msg': 'Payment Verified'})
        except Order.DoesNotExist:
            return Response({'success': False, 'msg': 'Order Not Found'}, status=404)
