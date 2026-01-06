import React, { useState } from 'react';
// import { useMenu } from '../../context/useMenu';
import { type Deal, type Product } from '../../types';
import {
  Trash2,
  Tag,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Flame,
  Leaf,
  Wheat,
  ShoppingBag,
  Banknote,
} from 'lucide-react';
import { ConfirmModal } from '../Common/ConfirmModal';
import axiosInstance from '../../api/axiosInstance';

interface DealGalleryProps {
  deals: Deal[];
  onRefresh: () => void;
}

export const DealGallery: React.FC<DealGalleryProps> = ({ deals, onRefresh }) => {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isOrdering, setIsOrdering] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await axiosInstance.delete(`/deals/${deleteModal.id}`);
      setToast({ msg: 'Deal deleted successfully!', type: 'success' });
      onRefresh();
    } catch {
      setToast({ msg: 'Failed to delete deal', type: 'error' });
    } finally {
      setDeleteModal({ isOpen: false, id: null });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axiosInstance.patch(`/deals/${id}/status`, { status: newStatus });
      setToast({ msg: `Deal is now ${newStatus}`, type: 'success' });
      onRefresh();
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ msg: 'Status update failed', type: 'error' });
    }
  };

  const handleSelectDeal = async (deal: Deal) => {
    try {
      setIsOrdering(deal._id!);

      // Extract price from the backend field 'price'
      const dealPrice = Number((deal as any).price) || 0;

      const orderData = {
        items: [
          {
            dealId: deal._id,
            name: deal.dealName,
            price: dealPrice,
            quantity: 1,
          },
        ],
        totalAmount: dealPrice,
      };

      await axiosInstance.post('/orders', orderData);
      setToast({ msg: 'Deal added to orders successfully!', type: 'success' });
    } catch (error) {
      console.error('Order error:', error);
      setToast({ msg: 'Failed to place order', type: 'error' });
    } finally {
      setIsOrdering(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="mb-10 relative">
      {toast && (
        <div
          className={`fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white z-[110] animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-bold">{toast.msg}</span>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Deal?"
        message="Are you sure you want to remove this deal? All associated item groupings for this deal will be lost."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />

      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-black text-gray-800">Active Deals</h3>
        <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md text-xs font-bold">
          {deals.length}
        </span>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {deals.length === 0 ? (
          <div className="w-full py-10 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400">
            <Tag size={32} className="mb-2 opacity-20" />
            <p className="italic font-medium">No active deals found in database.</p>
          </div>
        ) : (
          deals.map((deal) => {
            // Correctly access the 'price' property from the database
            const price = Number((deal as any).price) || 0;
            return (
              <div
                key={deal._id}
                className={`group min-w-[320px] p-6 border-2 rounded-[2.5rem] transition-all relative overflow-hidden flex flex-col ${
                  deal.status === 'inactive'
                    ? 'bg-gray-50 border-gray-100 grayscale opacity-70'
                    : 'bg-white border-indigo-50 shadow-xl shadow-indigo-100/40 hover:border-[#ffeade]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 text-[10px] font-black rounded-full tracking-wider ${
                      deal.status === 'active'
                        ? 'bg-[#fff3ed] text-[#ff772e]'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {deal.status === 'active' ? 'Active Deal' : 'Hidden'}
                  </span>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleStatus(deal._id!, deal.status || 'active')}
                      className="cursor-pointer p-2 text-gray-400 hover:text-[#ff772e] hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      {deal.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    <button
                      onClick={() => handleDeleteClick(deal._id!)}
                      className="cursor-pointer p-2 text-gray-300 hover:text-[#ff5a00] hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex -space-x-3 mb-4 overflow-hidden">
                  {(deal.productIds as any).slice(0, 4).map((product: Product, idx: number) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-sm"
                    >
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                          <Tag size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                  {deal.productIds.length > 4 && (
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                      +{deal.productIds.length - 4}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-xl font-black text-gray-800 truncate">{deal.dealName}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Banknote
                      size={12}
                      className={price > 0 ? 'text-emerald-500' : 'text-rose-400'}
                    />
                    <span
                      className={`text-xs font-black ${price > 0 ? 'text-gray-900' : 'text-rose-500'}`}
                    >
                      {price > 0 ? `£${price.toFixed(2)}` : price}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 mb-6">
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.15em]">
                    Included Items
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(deal.productIds as any).map((product: Product, idx: number) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-medium text-xs transition-colors ${
                          deal.status === 'active'
                            ? 'bg-[#fefbf8] text-[#ff8a4a] border-[#fbe7dc]'
                            : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}
                      >
                        <span>{product.productName || 'Product Deleted'}</span>
                        <div className="flex gap-1">
                          {product.dietaryInfo?.isSpicy && (
                            <Flame size={10} className="text-orange-500" />
                          )}
                          {product.dietaryInfo?.isVegan && (
                            <Leaf size={10} className="text-emerald-500" />
                          )}
                          {product.dietaryInfo?.isVegetarian && (
                            <Wheat size={10} className="text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={deal.status === 'inactive' || isOrdering === deal._id}
                  onClick={() => handleSelectDeal(deal)}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    deal.status === 'inactive'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200'
                  }`}
                >
                  {isOrdering === deal._id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      Select Deal
                    </>
                  )}
                </button>

                <div className="absolute -bottom-4 -right-4 bg-indigo-50/30 w-16 h-16 rounded-full blur-2xl" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};