import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CheckCircle, Clock, Package, Truck, ArrowLeft } from 'lucide-react';
import type { AppDispatch, RootState } from '../features/store';
import { fetchOrderDetails } from '../features/orders/ordersSlice';
import L from 'leaflet';

// Fix Leaflet Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { activeOrder: order, isLoading, error } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetails(orderId));
        }
    }, [dispatch, orderId]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading Tracking Info...</div>;
    if (error || !order) return <div className="h-screen flex items-center justify-center text-red-500">Order not found</div>;

    const steps = [
        { status: 'PENDING', label: 'Order Placed', icon: Clock },
        { status: 'PACKING', label: 'Packed', icon: Package },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.delivery_status);
    const isDelivered = order.delivery_status === 'DELIVERED';
    const isOut = order.delivery_status === 'OUT_FOR_DELIVERY';

    // Mock Driver Location (or real if available) - Lucknow Coordinates
    const position: [number, number] = [
        order.driver_location_lat || 26.8467,
        order.driver_location_lng || 80.9461
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <ArrowLeft size={20} className="text-gray-700 dark:text-gray-200" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">Track Order</h1>
                    <p className="text-xs text-gray-500">ID: {order.id.slice(0, 8)}</p>
                </div>
            </header>

            {/* Map Section - Only show if Out for Delivery or Tracking Enabled */}
            <div className="h-72 w-full bg-gray-200 relative z-0">
                {isOut ? (
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                {order.driver_name ? `${order.driver_name} is here` : 'Driver Location'}
                            </Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Package size={40} className="text-green-600" />
                        </div>
                        <p className="font-bold text-gray-600 dark:text-gray-300">
                            {isDelivered ? 'Order Delivered' : 'Preparing your order...'}
                        </p>
                    </div>
                )}
            </div>

            {/* Status Timeline */}
            <div className="p-6 bg-white dark:bg-gray-800 -mt-6 rounded-t-3xl relative z-10 shadow-lg">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-center w-full">
                        <p className="text-sm text-gray-500">Estimated Delivery</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isDelivered
                                ? 'Delivered'
                                : order.delivery_status === 'PENDING'
                                    ? 'Pending Approval'
                                    : 'Within 6 Hours'
                            }
                        </h2>
                    </div>
                </div>

                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.status} className="relative pl-6">
                                <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                                    }`}>
                                    <step.icon size={18} />
                                </div>
                                <div>
                                    <h3 className={`font-bold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                        {step.label}
                                    </h3>
                                    {isCurrent && !isDelivered && (
                                        <p className="text-xs text-green-600 font-bold animate-pulse">Processing...</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Driver Info (Privacy Mode) */}
                {isOut && order.driver_name && (
                    <div className="mt-8 bg-green-50 dark:bg-gray-700 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${order.driver_name}&background=random`} alt="Driver" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">{order.driver_name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-300">Delivery Partner • {order.driver_phone ? 'Verified' : ''}</p>
                        </div>
                        {order.driver_phone && (
                            <a href={`tel:${order.driver_phone}`} className="bg-white p-2 rounded-full shadow-sm text-green-600">
                                Call
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
