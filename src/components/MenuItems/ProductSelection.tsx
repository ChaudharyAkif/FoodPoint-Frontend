import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  X,
  Search,
  AlertCircle,
  Pencil,
  Flame,
  Leaf,
  Wheat,
  PlusCircle,
  ImageIcon,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
// import { useMenu } from '../../context/MenuContext';
import { useMenu } from '../../context/useMenu';



interface ProductSelectionProps {
  onDealCreated: () => void;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({ onDealCreated }) => {
  // 2. UPDATED: Consume global context instead of local state
  const { products, refreshData, } = useMenu();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
console.log("products",products)
  const [showModal, setShowModal] = useState(false);
  const [dealName, setDealName] = useState('');
  const [dealPrice, setDealPrice] = useState<string>('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // 3. UPDATED: Filter products derived from Context
 // 3. UPDATED: Filter products derived from Context with safety check


 console.log("products", products)
 console.log("refreshData", refreshData)
  const filteredProducts = useMemo(() => {
    return (products ?? []).filter((p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleRestock = async (id: string) => {
    const restockAmount = 10;
    try {
      await axiosInstance.patch(`/products/${id}/restock`, {
        amount: restockAmount,
      });

      // 4. UPDATED: Refresh global data to reflect new quantity across all pages
      await refreshData();

      setToast({ msg: `added ${restockAmount} units to stock!`, type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ msg: 'restock failed. check server connection.', type: 'error' });
    }
  };

  const handleCreateDeal = async () => {
    if (!dealName.trim()) {
      setToast({ msg: 'please enter a deal name', type: 'error' });
      return;
    }
    if (!dealPrice || Number(dealPrice) < 0) {
      setToast({ msg: 'please enter a valid deal price', type: 'error' });
      return;
    }

    try {
      await axiosInstance.post('/deals', {
        dealName,
        productIds: selectedIds,
        price: Number(dealPrice),
      });

      setToast({ msg: 'deal created & inventory updated!', type: 'success' });
      setShowModal(false);
      setDealName('');
      setDealPrice('');
      setSelectedIds([]);

      // 5. UPDATED: Sync global state after deal creation
      await refreshData();
      onDealCreated();
    } catch {
      setToast({ msg: 'insufficient stock or server error', type: 'error' });
    }
  };

  return (
    <div className="relative">
      {toast && (
        <div
          className={`fixed bottom-5 right-5 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white z-50 animate-in fade-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-primary'}`}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-bold">{toast.msg}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-gray-100 text-left">
            <h3 className="text-2xl font-black mb-1 text-gray-900 tracking-tight uppercase">
              configure this deal
            </h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">
              set your bundle name and price
            </p>

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  deal name
                </p>
                <input
                  autoFocus
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#ff5a00]/10 font-bold text-gray-700"
                  placeholder="e.g. family feast"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  bundle price
                </p>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-4 pl-8 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-[#ff5a00]/10 font-bold text-gray-700"
                    placeholder="0.00"
                    value={dealPrice}
                    onChange={(e) => setDealPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 text-gray-500 font-bold bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={handleCreateDeal}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:bg-[#e65100] active:scale-95 transition-all uppercase text-xs tracking-widest"
              >
                save deal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter text-left">
            product selection
          </h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#ff5a00]/10 transition-all outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-3xl overflow-hidden max-h-[500px] overflow-y-auto scrollbar-hide bg-gray-50/20">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic font-medium uppercase tracking-widest text-xs">
              no products found.
            </div>
          ) : (
            filteredProducts.map((product) => {
              const productQty = product.quantity ?? 0;
              const isOutOfStock = productQty <= 0;

              return (
                <div
                  key={product._id}
                  className={`group flex items-center justify-between p-5 transition-all ${isOutOfStock ? 'opacity-40 grayscale' : 'hover:bg-white hover:shadow-md'}`}
                >
                  <div className="flex items-start gap-5">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        disabled={isOutOfStock}
                        checked={selectedIds.includes(product._id!)}
                        onChange={() => handleToggle(product._id!)}
                        className={`peer w-6 h-6 rounded-lg border-2 border-gray-200 appearance-none checked:bg-[#ff5a00] checked:border-transparent transition-all ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      />
                      <CheckCircle
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                        size={16}
                      />
                    </div>

                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner mt-1">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    <div className="text-left flex-1">
                      <p
                        className={`font-black tracking-tight ${isOutOfStock ? 'text-gray-400' : 'text-gray-700'}`}
                      >
                        {product.productName}
                      </p>

                      {/* 6. FIXED: Correctly rendering populated extra names */}
                      {product.extras && product.extras.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                          {product.extras.map((extra, index) => {
                            const name =
                              typeof extra === 'object' && extra !== null ? extra.name : extra;
                            return (
                              <span
                                key={index}
                                className="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full lowercase flex items-center gap-1"
                              >
                                <Plus size={8} className="text-gray-300" /> {name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          $
                          {(product.variations?.[0]?.deliveryPrice || product.price || 0).toFixed(
                            2
                          )}{' '}
                          — qty: {productQty}
                        </p>
                        <div className="flex gap-1.5 ml-2">
                          {product.dietaryInfo?.isSpicy && (
                            <Flame size={14} className="text-primary" />
                          )}
                          {product.dietaryInfo?.isVegan && (
                            <Leaf size={14} className="text-emerald-500" />
                          )}
                          {product.dietaryInfo?.isVegetarian && (
                            <Wheat size={14} className="text-green-500" />
                          )}
                        </div>
                        {isOutOfStock && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-primary bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                            <AlertCircle size={10} /> out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestock(product._id!)}
                      className="p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <PlusCircle size={18} />
                    </button>
                    {!isOutOfStock && (
                      <button
                        type="button"
                        onClick={() => navigate(`/edit-item/${product._id}`)}
                        className="p-3 text-gray-300 hover:text-primary hover:bg-orange-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="cursor-pointer w-full mt-8 bg-primary hover:bg-[#e65100] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-orange-100 transition-all disabled:opacity-50 disabled:grayscale active:scale-95 uppercase tracking-widest text-sm"
          disabled={selectedIds.length === 0}
        >
          create new deal ({selectedIds.length} items selected)
        </button>
      </div>
    </div>
  );
};
