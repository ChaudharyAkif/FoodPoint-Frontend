import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Tag, PoundSterling } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

interface CreateOptionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductItem {
  _id: string;
  productName: string;
}

// 1. Updated Interface to include all form fields
interface OptionFormData {
  name: string;
  price: number;
  linkedProducts: string[];
}

export const CreateOptionModal: React.FC<CreateOptionModalProps> = ({ onClose, onSuccess }) => {
  const [availableProducts, setAvailableProducts] = useState<ProductItem[]>([]);
  
  // 2. Initialize useForm with the full OptionFormData interface
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OptionFormData>({
    defaultValues: { 
      name: '',
      price: 0, 
      linkedProducts: [] 
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        setAvailableProducts(res.data);
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, []);

  const onSubmit = async (data: OptionFormData) => {
    try {
      await axiosInstance.post('/options', data);
      onSuccess();
      onClose();
      reset();
    } catch {
      alert('Failed to create option.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>

        <div className="mb-10 text-left">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Add Individual Option</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Option Name</label>
            <div className="relative">
              <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              {/* This register('name') will now work correctly */}
              <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Beans" className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold" />
            </div>
            {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.name.message}</p>}
          </div>

          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Price (Set 0 for Free)</label>
            <div className="relative">
              <PoundSterling size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
            </div>
          </div>

          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Link to Products</label>
            <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-2">
              {availableProducts.map((prod) => (
                <label key={prod._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer">
                  <input type="checkbox" value={prod._id} {...register('linkedProducts')} className="w-4 h-4 accent-black" />
                  <span className="text-sm font-bold text-gray-700">{prod.productName}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all uppercase text-xs shadow-xl">
            <Save size={20} /> Create & Add to List
          </button>
        </form>
      </div>
    </div>
  );
};