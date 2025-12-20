from django.contrib import admin
from .models import User, Product, UnitOfMeasure, DeliveryZone, Order, OrderItem, Address, Category, Coupon

admin.site.register(User)
admin.site.register(UnitOfMeasure)
# admin.site.register(DeliveryZone) - registered via decorator below
admin.site.register(Category)
admin.site.register(Coupon)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_price', 'pricing_unit', 'is_organic')
    list_filter = ('is_organic', 'pricing_unit')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = ('zip_code', 'city', 'delivery_time_hrs', 'is_serviceable')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'payment_status', 'delivery_status', 'is_cod')
    inlines = [OrderItemInline]
