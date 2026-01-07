import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';
import { 
  ArrowBack, 
  DirectionsRun, 
  CreditCard
} from '@mui/icons-material';
import axiosInstance from '../../../api/axiosInstance';


interface ProductRef {
  _id: string;
  description?: string;
  image?: string;
}

interface OrderItem {
  _id: string;
  productId: ProductRef | null; // It might be null if product was deleted
  name: string;      // e.g. "Fish Butty (Med)"
  price: number;     // e.g. 6.60
  quantity: number;
}

interface IOrder {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string; // ISO Date string
  // Add delivery address fields if they exist in your Order model
}

const OrderDetails = () => {
  const { id } = useParams(); // Get the ID from the URL (e.g. /order/654...)
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const staleTextColor = "text-[#2D333D]";

  // Fetch Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Replace with your actual backend URL
        const response = await axiosInstance.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading order details...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

  // Static costs (replace these with DB fields if you add them to Order.ts later)
  const serviceCharge = 0.50;
  const deliveryFee = 2.50;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-12 font-sans selection:bg-orange-100">
      
      {/* Back Button */}
      <div className="flex items-center mb-8 cursor-pointer w-fit group" onClick={() => window.history.back()}>
        <ArrowBack sx={{ fontSize: 20, color: '#F25D07' }} className="mr-2" />
        <span className={`${staleTextColor} text-[14px] font-bold`}>Back</span>
      </div>

      <div className="max-w-275 mx-auto">
        
        {/* Main Order Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mb-10">
          <div className="p-8">
            
            {/* Header */}
            <div className="relative flex flex-col md:flex-row justify-between items-start mb-6">
              <div className="flex flex-col">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#5EA5D3] rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                   {/* Logic: Try to show image of first item, or placeholder */}
                    <img 
                      src={order.items[0]?.productId?.image || "https://via.placeholder.com/56"} 
                      alt="Shop Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-0.5">
                    <h1 className={`${staleTextColor} text-[15px] font-bold`}>Paddock Fish Bar</h1>
                    <p className={`${staleTextColor} text-[13px] leading-tight`}>203 Church Street, HD1 4UL</p>
                  </div>
                </div>

                <div className="flex gap-8 pt-6 ps-2">
                  <div className="flex items-center gap-2">
                    <DirectionsRun sx={{ fontSize: 18 }} className="text-[#5F6368]" />
                    <span className={`${staleTextColor} text-[14px] font-medium`}>Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard sx={{ fontSize: 18 }} className="text-[#5F6368]" />
                    <span className={`${staleTextColor} text-[14px] font-medium`}>Card</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right mt-4 md:mt-0">
                <div className="mb-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-xs font-normal ${
                      order.status === 'completed' ? 'bg-[#d8f1da] text-[#000000]' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                <div className="space-y-0.5">
                    {/* Using last 8 chars of ID as order number for display */}
                    <h2 className={`${staleTextColor} text-[15px] font-bold`}>Order # <span className="font-black">{order._id.slice(-8).toUpperCase()}</span></h2>
                    <div className="text-right text-[12px] text-gray-600 font-normal pt-1">
                        <p>Order placed: {new Date(order.createdAt).toLocaleString()} </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="w-full border-t border-gray-100">
              <div className="grid grid-cols-12 bg-[#F1F3F5] px-4 py-2.5 text-[12px] font-semibold text-[#5F6368]">
                <div className="col-span-1">Pcs.</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 px-4 py-4 items-center">
                      <div className={`col-span-1 ${staleTextColor} text-[13px]`}>
                        {item.quantity} x
                      </div>
                      
                      {/* Name from DB (e.g. Fish Butty (Med)) */}
                      <div className={`col-span-3 ${staleTextColor} text-[13px] font-medium`}>
                        {item.name}
                      </div>
                      
                      {/* Description from populated Product ID */}
                      <div className={`col-span-4 ${staleTextColor} text-[13px] text-gray-500`}>
                        {item.productId?.description || "No description"}
                      </div>
                      
                      {/* Price saved in Order */}
                      <div className={`col-span-2 text-right ${staleTextColor} text-[13px]`}>
                        ${item.price.toFixed(2)}
                      </div>
                      
                      <div className={`col-span-2 text-right ${staleTextColor} text-[14px] font-bold`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mt-2">
              <div className="w-full max-w-60 space-y-2">
                <div className="flex justify-between text-[13px] text-gray-600">
                  <span>Service charges</span>
                  <span>${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-600">
                  <span>Delivery fees</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 mt-1 border-t border-gray-200">
                  <span className={`${staleTextColor} text-[16px] font-bold`}>Total</span>
                  {/* Using the totalAmount from DB */}
                  <span className={`${staleTextColor} text-[16px] font-black`}>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[68%] flex flex-col space-y-3">
            <h3 className={`${staleTextColor} text-[13px] font-bold uppercase tracking-wide opacity-80`}>Additional information</h3>
            <div className="bg-white border border-gray-200 p-5 rounded-xs h-20 flex items-center shadow-sm">
              <p className={`${staleTextColor} text-[14px] font-bold`}>No notes for this order</p>
            </div>
          </div>
          
          <div className="w-full md:w-[32%] flex flex-col space-y-3">
            <h3 className={`${staleTextColor} text-[13px] font-bold uppercase tracking-wide opacity-80`}>Delivery address</h3>
            <div className="bg-white border border-gray-200 p-5 rounded-xs h-20 shadow-sm flex flex-col justify-center">
              <p className={`${staleTextColor} text-[13px] font-bold`}>Melanie Whittaker</p>
              <p className={`${staleTextColor} text-[12px] text-gray-600 leading-tight`}>132, Willwood Ave, HD3 4YB, Huddersfield</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;