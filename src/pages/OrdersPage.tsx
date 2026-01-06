import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Clock, ChevronDown, ChevronUp,
  Calendar, Database, HardDrive, Loader2, ArrowLeft,
  Search, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

// Define types matching your Order.ts
interface OrderItem {
  productId?: string;
  dealId?: string;
  name: string;
  price: number;
  quantity: number;
}

interface IOrder {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  source?: 'db' | 'local';
}

const OrdersPage = () => {
  const navigate = useNavigate();
  useAuth();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATE (Only Search remains) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 1. Fetch from Database
      let dbOrders: IOrder[] = [];
      try {
        const response = await axiosInstance.get('/orders');
        dbOrders = response.data.map((o: any) => ({ ...o, source: 'db' }));
      } catch (err) {
        console.error("Failed to fetch DB orders", err);
      }

      // 2. Fetch from Local Storage
      const localData = localStorage.getItem('foodpoint_orders');
      const localOrders: IOrder[] = localData
        ? JSON.parse(localData).map((o: any) => ({ ...o, source: 'local' }))
        : [];

      // 3. Combine and Sort
      const allOrders = [...dbOrders, ...localOrders].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Menu
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500">Track your past and current orders</p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center min-w-25">
              <div className="text-xs text-gray-500 uppercase font-bold">Total</div>
              <div className="text-xl font-bold text-gray-900">{orders.length}</div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center min-w-25">
              <div className="text-xs text-gray-500 uppercase font-bold">Spent</div>
              <div className="text-xl font-bold text-orange-500">
                ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* --- SEARCH BAR (Filters Removed) --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 hover:border-red-200 flex items-center gap-2 text-sm font-medium"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <button
              onClick={() => {
                setSearchQuery('');
                navigate('/');
              }}
              className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
            >
              {searchQuery ? 'Clear Search' : 'Start Ordering'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div
                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                    className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${order.source === 'db' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                        {order.source === 'db' ? <Database className="w-6 h-6" /> : <HardDrive className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-14 md:pl-0">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                      </div>
                      <div className="text-gray-400">
                        {expandedOrderId === order._id ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  <AnimatePresence>
                    {expandedOrderId === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-gray-50/50 px-5 py-4"
                      >
                        <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                  {item.quantity}x
                                </div>
                                <span className="font-medium text-gray-900">{item.name}</span>
                              </div>
                              <span className="text-gray-600 font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;