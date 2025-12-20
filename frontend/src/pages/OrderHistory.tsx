import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import client from '../api/client';
import { format } from 'date-fns';

interface OrderItem {
    product_name: string;
    quantity: number;
    price_at_purchase: string;
}

interface Order {
    id: string;
    total_price: string;
    payment_status: string;
    delivery_status: string;
    items: OrderItem[];
    created_at: string;
}

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('orders/history/')
            .then(res => {
                setOrders(res.data.data || res.data); // Handle wrapper
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Orders...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 max-w-3xl mx-auto transition-colors">
            <header className="bg-white dark:bg-gray-800 p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 border-b dark:border-gray-700">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="font-bold text-lg text-gray-800 dark:text-white">Your Orders</h1>
            </header>

            <main className="p-4 space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Package size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No orders yet</p>
                        <button onClick={() => navigate('/')} className="mt-4 text-green-600 font-bold">Start Shopping</button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3 border-b border-gray-100 dark:border-gray-700 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {order.delivery_status === 'DELIVERED' ? (
                                            <CheckCircle size={16} className="text-green-500" />
                                        ) : order.delivery_status === 'CANCELLED' ? (
                                            <XCircle size={16} className="text-red-500" />
                                        ) : (
                                            <Clock size={16} className="text-orange-500" />
                                        )}
                                        <span className="font-bold text-gray-800 dark:text-gray-200 uppercase text-sm">{order.delivery_status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">₹{parseFloat(order.total_price).toFixed(0)}</p>
                                    <p className="text-xs text-gray-400">#{order.id.slice(0, 8)}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                        <span>{item.quantity} x {item.product_name}</span>
                                        <span className="text-gray-400">₹{parseFloat(item.price_at_purchase).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                                {['PENDING', 'PACKING', 'OUT_FOR_DELIVERY'].includes(order.delivery_status) && (
                                    <button
                                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                                        className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded border border-blue-200 dark:border-blue-800"
                                    >
                                        Track Order
                                    </button>
                                )}
                                <button className="text-green-600 dark:text-green-400 text-xs font-bold uppercase hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-1 rounded">
                                    Repeat Order
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default OrderHistory;
