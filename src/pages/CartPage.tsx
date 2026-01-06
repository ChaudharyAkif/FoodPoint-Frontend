// src/pages/CartPage.tsx
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, ShoppingBag, ArrowLeft, CreditCard,
  Truck, User, MapPin, Phone, MessageSquare, Trash2, Plus, Minus,
  Loader2, ReceiptText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance'; // Ensure this exists
import { Receipt } from '../components/Menu/Receipt';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const CartPage = () => {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // -------------------- STATES --------------------
  const isCashier = user?.role === 'cashier';
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [printFormat] = useState<'thermal' | 'a4'>('thermal');
  const [lastOrderId, setLastOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'summary'>('summary');

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    phone: '', 
    address: '',
    apartment: '',
    city: '',
    zipCode: '',
    instructions: '',
    email: user?.email || '',
  });

  const receiptRef = useRef<HTMLDivElement>(null);

  // -------------------- CONSTANTS --------------------
  const deliveryFee = cart.total > 25 ? 0 : 4.99;
  const taxRate = 0.1;
  const tax = cart.total * taxRate;
  const subtotal = cart.total;
  const total = subtotal + deliveryFee + tax;

  // -------------------- HANDLERS --------------------
  const handleDownload = async () => {
    const element = receiptRef.current;
    if (!element) return;

    // 1. Clone & Sanitize for PDF
    const clone = element.cloneNode(true) as HTMLElement;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.appendChild(clone);
    document.body.appendChild(container);

    clone.innerHTML = clone.innerHTML.replace(/PADDOCK FISH BAR/gi, "FOOD POINT");
    clone.innerHTML = clone.innerHTML.replace(/www.paddockfishbar.com/gi, "www.foodpoint.com");

    // Add Customer Info
    const infoSection = clone.querySelector('.text-center'); 
    if (infoSection) {
        const customerDiv = document.createElement('div');
        customerDiv.style.textAlign = 'left';
        customerDiv.style.fontSize = '12px';
        customerDiv.style.margin = '10px 0';
        customerDiv.style.borderBottom = '1px dashed #000';
        customerDiv.innerHTML = `
            <div><strong>Customer:</strong> ${customerDetails.name || 'Walk-in'}</div>
            <div><strong>Phone:</strong> ${customerDetails.phone || 'N/A'}</div>
        `;
        infoSection.after(customerDiv);
    }

    const allElements = clone.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i] as HTMLElement;
        el.style.color = '#000000'; 
        el.style.borderColor = '#000000';
        el.style.backgroundImage = 'none';
        if (el.tagName !== 'TR' && el.tagName !== 'TD') el.style.backgroundColor = '#ffffff'; 
    }
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';

    const opt: any = {
      margin: 10,
      filename: `Receipt-${lastOrderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error("PDF Failed:", err);
      alert("Receipt download failed.");
    } finally {
      document.body.removeChild(container);
      document.querySelectorAll('.html2pdf__overlay').forEach(el => el.remove());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${lastOrderId}`,
    pageStyle: (printFormat === 'thermal' && isCashier)
      ? `@page { size: 80mm auto; margin: 0; }` 
      : `@page { size: A4; margin: 20mm; }`
  });

  // --- CHECKOUT LOGIC ---
  // FIXED: CartPage.tsx - handleCheckout function
// Replace your existing handleCheckout function with this:

const handleCheckout = async () => {
  if (cart.items.length === 0) { 
    alert('Cart is empty'); 
    return; 
  }

  // Validation for non-cashiers
  if (!isCashier) {
    const { name, phone, address, city, zipCode } = customerDetails;
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
      alert('Please enter all required delivery details');
      return;
    }
  }

  setCheckoutLoading(true);

  // Generate Client-Side ID for immediate display
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  setLastOrderId(orderId);

  // --- CASHIER: SAVE TO DB ---
  if (isCashier) {
    try {
      // ✅ FIX 1: Map cart items with proper validation
      const formattedItems = cart.items.map(item => {
        const baseItem = {
          name: item.name,
          price: item.price,
          quantity: item.quantity
        };

        // Add productId OR dealId based on type
        if (item.type === 'product') {
          return { ...baseItem, productId: item.id };
        } else if (item.type === 'deal') {
          // Check both possible locations for dealId
          const dealId = (item as any).dealId || item.id;
          return { ...baseItem, dealId };
        }
        
        return baseItem;
      });

      // ✅ FIX 2: Match backend schema exactly
      const orderPayload = {
        orderId,                    // ✅ Now included
        items: formattedItems,
        totalAmount: total,         // ✅ Changed from 'total' to 'totalAmount'
        address: customerDetails.address || 'Walk-in Order',
        paymentMethod: 'cash',
        placedBy: user?.name || 'Cashier',
        role: 'cashier'
      };

      console.log('📦 Sending order payload:', orderPayload); // Debug log

      // ✅ FIX 3: Proper error handling
      const response = await axiosInstance.post('/orders', orderPayload);
      
      console.log('✅ Order created:', response.data); // Debug log

      // Success Flow
      setCheckoutLoading(false);
      setShowSuccessModal(true);
      setTimeout(() => handlePrint(), 500); // Auto-print for cashier

    } catch (error: any) {
      console.error("❌ Order Save Failed:", error);
      console.error("Error response:", error.response?.data); // More detailed error
      
      setCheckoutLoading(false);
      
      // Better error message
      const errorMsg = error.response?.data?.message || 'Failed to save order to database';
      alert(`Order failed: ${errorMsg}`);
    }
  } else {
    // --- REGULAR USER (Simulation for now, or add user DB logic here) ---
    setTimeout(() => {
      setCheckoutLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  }
};

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    clearCart();
    navigate('/');
  };

  // -------------------- RENDER --------------------
  if (cart.items.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-orange-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-linear-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <motion.button onClick={() => navigate('/')} className="bg-linear-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-3 mx-auto">
            <ArrowLeft className="w-5 h-5" /> Browse Menu
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 to-orange-50 py-8">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" /> <span className="font-medium">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 text-sm">{cart.items.length} items in cart</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {['Cart', 'Details', 'Payment', 'Confirm'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${index === 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{index + 1}</div>
              <span className={`text-sm font-medium ${index === 0 ? 'text-orange-600' : 'text-gray-500'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Order Items</h2>
                <button onClick={() => setActiveTab(activeTab === 'summary' ? 'details' : 'summary')} className="text-sm text-orange-500 font-medium">{activeTab === 'summary' ? 'Show Details' : 'Show Summary'}</button>
              </div>
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div key={item.id} variants={itemVariants} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-4 p-4 mb-4 bg-linear-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div><h4 className="font-bold text-gray-900">{item.name}</h4><p className="text-sm text-gray-500">{item.type === 'deal' ? 'Special Deal' : 'Menu Item'}</p></div>
                        <div className="text-right"><div className="font-bold text-orange-500 text-lg">${(item.price * item.quantity).toFixed(2)}</div><div className="text-sm text-gray-500">${item.price} each</div></div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg" disabled={item.quantity <= 1}><Minus className="w-4 h-4" /></button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {!isCashier && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Truck className="w-5 h-5" /> Delivery Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><User className="inline w-4 h-4 mr-2" /> Full Name *</label><input name="name" value={customerDetails.name} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="John Doe" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="inline w-4 h-4 mr-2" /> Phone Number *</label><input name="phone" value={customerDetails.phone} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="+12 3456 78901" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="inline w-4 h-4 mr-2" /> Delivery Address *</label><textarea name="address" value={customerDetails.address} onChange={handleInputChange} required rows={3} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="123 Street" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm text-gray-700 mb-2">Apartment</label><input name="apartment" value={customerDetails.apartment} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Apt" /></div>
                    <div><label className="block text-sm text-gray-700 mb-2">City *</label><input name="city" value={customerDetails.city} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="New York" /></div>
                    <div><label className="block text-sm text-gray-700 mb-2">ZIP Code *</label><input name="zipCode" value={customerDetails.zipCode} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="ZIP" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2"><MessageSquare className="inline w-4 h-4 mr-2" /> Instructions</label><textarea name="instructions" value={customerDetails.instructions} onChange={handleInputChange} rows={2} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Dietary restrictions, etc." /></div>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h3>
              <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-white text-xl">💵</span></div><div><div className="font-bold text-lg">Cash on Delivery</div><div className="text-sm text-gray-600">Pay on arrival</div></div></div></div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ReceiptText className="w-5 h-5" /> Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600"><span>Items</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold"><span>Total</span><span className="text-orange-500">${total.toFixed(2)}</span></div>
              </div>
              <button onClick={handleCheckout} disabled={checkoutLoading} className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg ${checkoutLoading ? 'bg-gray-300' : 'bg-linear-to-r from-orange-500 to-red-500'}`}>{checkoutLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Place Order • $${total.toFixed(2)}`}</button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- HIDDEN RECEIPT --- */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div ref={receiptRef} style={{ background: '#fff', color: '#000', fontFamily: 'Arial' }}>
           <Receipt items={cart.items} total={total} orderId={lastOrderId} format={printFormat} />
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative z-101">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
              <p className="text-gray-600 mb-6">Order ID: {lastOrderId}</p>
              <div className="space-y-3">
                {isCashier ? <button onClick={handlePrint} className="w-full bg-black text-white py-3 rounded-xl font-bold">Print Receipt</button> : <button onClick={handleDownload} className="w-full bg-black text-white py-3 rounded-xl font-bold">Download Receipt</button>}
                <button onClick={handleCloseSuccess} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold">Continue Shopping</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
            <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Clear Cart?</h3>
              <div className="flex gap-3"><button onClick={() => setShowDeleteConfirm(false)} className="flex-1 border py-2 rounded-xl">Cancel</button><button onClick={() => { clearCart(); setShowDeleteConfirm(false); }} className="flex-1 bg-red-500 text-white py-2 rounded-xl">Clear</button></div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;