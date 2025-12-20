from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Coupon
from .renderers import StandardResponseRenderer
from .serializers import CouponSerializer # Assuming this exists, if not I will use ad-hoc serializer

class ApplyCouponView(APIView):
    renderer_classes = [StandardResponseRenderer]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        order_total = request.data.get('order_total')

        if not code or not order_total:
            return Response({'error': 'Code and Order Total required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            
            # Check Validity
            if coupon.valid_until and coupon.valid_until < timezone.now():
                return Response({'error': 'Coupon Expired'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Welcome Offer Logic
            if coupon.code.upper() == 'WELCOME50':
                if request.user.orders.filter(payment_status='COMPLETED').exists():
                     return Response({'error': 'This offer is for new users only.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check Min Order
            if float(order_total) < float(coupon.min_order_value):
                return Response({
                    'error': f'Minimum order value of ₹{coupon.min_order_value} required'
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'success': True,
                'coupon': code,
                'discount_amount': float(coupon.discount_amount),
                'message': 'Coupon Applied Successfully'
            })

        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid Coupon Code'}, status=status.HTTP_400_BAD_REQUEST)

class CouponListView(generics.ListAPIView):
    queryset = Coupon.objects.filter(is_active=True)
    renderer_classes = [StandardResponseRenderer]
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [{
            'code': c.code,
            'discount_amount': float(c.discount_amount),
            'min_order_value': float(c.min_order_value),
            'desc': f"Get ₹{c.discount_amount} OFF above ₹{c.min_order_value}"
        } for c in queryset]
        return Response(data)
