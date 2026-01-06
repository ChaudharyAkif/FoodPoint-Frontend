import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Layers } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface OptionItem {
  _id: string;
  name: string;
}

interface ProductItem {
  _id: string;
  productName: string;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onSuccess }) => {
  const [availableOptions, setAvailableOptions] = useState<OptionItem[]>([]);
  const [availableProducts, setAvailableProducts] = useState<ProductItem[]>([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optRes, prodRes] = await Promise.all([
          axiosInstance.get('/options'),
          axiosInstance.get('/products')
        ]);
        setAvailableOptions(optRes.data);
        setAvailableProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await axiosInstance.post('/option-groups', data);
      onSuccess();
      onClose();
      reset();
    } catch {
      alert('Failed to create group. Check server connection.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>

        <div className="mb-10 text-left">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Create Option Group</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Group Name</label>
            <div className="relative">
              <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input {...register('name', { required: true })} placeholder="e.g. Choose your sauce" className="w-full p-5 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-5 bg-orange-50 rounded-2xl border border-orange-100">
            <input type="checkbox" {...register('isRequired')} className="w-5 h-5 accent-orange-500" />
            <p className="font-bold text-orange-900 text-sm">Required Selection</p>
          </div>

          {/* Included Options List */}
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Included Options</label>
            <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-2">
              {availableOptions.map((opt) => (
                <label key={opt._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer">
                  <input type="checkbox" value={opt._id} {...register('options')} className="w-4 h-4 accent-black" />
                  <span className="text-sm font-bold text-gray-700">{opt.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Linkage List */}
          <div className="text-left">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block tracking-widest">Link to Products</label>
            <div className="max-h-32 overflow-y-auto bg-gray-100 rounded-2xl p-4 space-y-2">
              {availableProducts.map((prod) => (
                <label key={prod._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer">
                  <input type="checkbox" value={prod._id} {...register('linkedProducts')} className="w-4 h-4 accent-black" />
                  <span className="text-sm font-bold text-gray-700">{prod.productName}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all uppercase text-xs shadow-xl">
            <Save size={20} /> Save Option Group
          </button>
        </form>
      </div>
    </div>
  );
};