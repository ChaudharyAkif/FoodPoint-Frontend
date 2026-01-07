import React, { useState, useEffect } from 'react'; // Added useEffect import
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import {
  PackagePlus,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  ShoppingBag,
  ImageIcon,
  FileText,
  Edit3,
  ChevronDown,
  Plus,
  LinkIcon, // Ensure Tag is used
} from 'lucide-react';
import { DynamicExtras } from './DynamicExtras';
import { type Product, type DealAction } from '../../types';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';
import API from '../../api/API';

interface FormValues {
  products: Product[];
  dealAction: DealAction;
  dealName?: string;
}

const AddProductForm: React.FC = () => {
  const [customCategories, setCustomCategories] = useState<string[]>([
    'Starters',
    'Italian',
    'Fast Food',
    'Chinese',
    'Desi',
    'Desserts',
  ]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // 1. Fetch and Merge Categories on Mount
  useEffect(() => {
    const fetchExistingCategories = async () => {
      try {
        const response = await axiosInstance.get('/products');
        const dbProducts = response.data || [];

        const existingCats = dbProducts
          .map((p: any) => p.category)
          .filter((cat: string) => cat && cat.trim() !== '');

        const defaultCats = ['Starters', 'Italian', 'Fast Food', 'Chinese', 'Desi', 'Desserts'];
        // Use a Set to ensure absolute uniqueness
        const combined = Array.from(new Set([...defaultCats, ...existingCats]));

        setCustomCategories(combined.sort());
      } catch (err) {
        console.error('Failed to sync categories:', err);
      }
    };
    fetchExistingCategories();
  }, []);

  const { register, control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      products: [
        {
          productName: '',
          price: 0,
          quantity: 10,
          image: '',
          description: '',
          category: '',
          extras: [],
          variations: [],
          dietaryInfo: { is18Plus: false, isSpicy: false, isVegan: false, isVegetarian: false },
        },
      ],
      dealAction: 'new',
      dealName: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);

  const watchDealAction = watch('dealAction');
  const watchAllProducts = watch('products');

  // const onSubmit: SubmitHandler<FormValues> = async (data) => {
  //   try {
  //     const formData = new FormData();

  //     watchAllProducts.forEach((p, idx) => {
  //       const file = imageFiles[idx];
  //       if (file) formData.append('images', file); // key must match multer.array('images')
  //     });

  //     formData.append(
  //       'products',
  //       JSON.stringify(
  //         data.products.map((p) => ({
  //           ...p,
  //           image: '', // backend will attach Cloudinary URL
  //         }))
  //       )
  //     );

  //     formData.append('dealAction', data.dealAction);
  //     if (data.dealName) formData.append('dealName', data.dealName);

  //     // ✅ DO NOT set Content-Type
  //     console.log(formData);
  //     await axiosInstance.post('/products/bulk-create', formData);

  //     setToast({ msg: 'Products saved successfully!', type: 'success' });
  //     reset();
  //     setImageFiles([]);
  //   } catch (err) {
  //     console.error(err);
  //     setToast({ msg: 'Upload failed', type: 'error' });
  //   }
  // };
 const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = new FormData();

      // Append real files for backend
      imageFiles.forEach((file) => {
        if (file) formData.append('images', file);
      });

      // Append products JSON (image will be handled by backend)
      formData.append(
        'products',
        JSON.stringify(
          data.products.map((p) => ({
            ...p,
            image: '', // backend sets Cloudinary URL
          }))
        )
      );

      formData.append('dealAction', data.dealAction);
      if (data.dealName) formData.append('dealName', data.dealName);

      // 🔍 Check what is sent
      console.log('===== FORM DATA =====');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send via axios
      await API.post('/products/bulk-create', formData);

      setToast({ msg: 'Products saved successfully!', type: 'success' });
      reset();
      setImageFiles([]);
    } catch (err) {
      console.error(err);
      setToast({ msg: 'Upload failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center py-10 px-4 md:px-6 bg-gray-50/50">
      <div className="relative border border-gray-100 rounded-3xl p-8 bg-white shadow-sm w-full max-w-6xl">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white z-50 animate-in fade-in slide-in-from-bottom-6 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-bold text-sm">{toast.msg}</span>
            <button type="button" onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-left">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Add Products</h2>
            <p className="text-gray-500 font-medium text-xs">
              Configure your catalog items and deals.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              append({
                productName: '',
                price: 0,
                quantity: 10,
                image: '',
                description: '',
                category: '',
                extras: [],
                variations: [],
                dietaryInfo: {
                  is18Plus: false,
                  isSpicy: false,
                  isVegan: false,
                  isVegetarian: false,
                },
              })
            }
            className="flex cursor-pointer items-center gap-2 bg-primary text-white text-xs px-8 py-3 rounded-full font-black shadow-lg hover:bg-[#e65100] active:scale-95 transition-all"
          >
            <PackagePlus size={20} /> Add Item Slot
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {fields.map((field, index) => {
            const currentImageUrl = watchAllProducts[index]?.image;
            const selectedCategory = watch(`products.${index}.category`);

            return (
              <div
                key={field.id}
                className="group bg-white border border-gray-200 p-8 rounded-[2rem] shadow-sm relative text-left"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-3 -right-3 cursor-pointer bg-white text-gray-300 hover:text-rose-500 p-3 rounded-full border border-gray-100 shadow-md z-10 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    {/* Item Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-gray-400 block mb-1 tracking-widest uppercase">
                          Item Name
                        </label>
                        <input
                          {...register(`products.${index}.productName` as const, {
                            required: true,
                          })}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#ff5a00]/20 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 block mb-1 tracking-widest uppercase">
                          Base Price $)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`products.${index}.price` as const, { valueAsNumber: true })}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 block mb-1 tracking-widest uppercase">
                          Initial Stock
                        </label>
                        <input
                          type="number"
                          {...register(`products.${index}.quantity` as const, {
                            valueAsNumber: true,
                          })}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <FileText size={16} className="absolute left-4 top-4 text-gray-300" />
                        <input
                          {...register(`products.${index}.description` as const)}
                          placeholder="Description (Optional)..."
                          className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                        />
                      </div>

                      {/* Category Selection Component */}
                      <div className="w-1/3 relative">
                        <div className="flex items-center gap-1">
                          <div className="relative flex-1 group">
                            <div className="w-full p-2 bg-white border border-gray-200 rounded-2xl flex items-center min-h-[56px] focus-within:border-gray-400 transition-all">
                              <div className="flex flex-1 items-center overflow-hidden">
                                {selectedCategory ? (
                                  <div className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-full ml-3 animate-in zoom-in-95 duration-200">
                                    <span className="text-[12px] font-bold whitespace-nowrap">
                                      {selectedCategory}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setValue(`products.${index}.category`, '')}
                                      className="hover:text-gray-300 transition-colors"
                                    ></button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs ml-4 font-medium italic">
                                    Category
                                  </span>
                                )}
                              </div>

                              <select
                                {...register(`products.${index}.category` as const)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              >
                                <option value="">Select Category</option>
                                {customCategories
                                  .filter((cat) => {
                                    const otherSlots = watchAllProducts || [];
                                    return !otherSlots.some(
                                      (p, i) => i !== index && p.category === cat
                                    );
                                  })
                                  .map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                              </select>
                              <ChevronDown size={16} className="text-gray-400 mr-2 shrink-0" />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowCatModal(true)}
                            className="cursor-pointer w-10 h-14 flex items-center justify-center bg-primary text-white rounded-2xl hover:bg-black active:scale-95 transition-all shrink-0 shadow-lg"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Section - Dual Mode (Gallery + URL) */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 block uppercase tracking-widest ml-1">
                        Product Image
                      </label>

                      <div className="flex flex-col md:flex-row items-start gap-4">
                        {/* Preview Box */}
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-gray-100 overflow-hidden flex items-center justify-center shadow-inner shrink-0 relative group">
                          {currentImageUrl ? (
                            <>
                              <img
                                src={currentImageUrl}
                                className="w-full h-full object-cover"
                                alt="preview"
                              />
                              <button
                                type="button"
                                onClick={() => setValue(`products.${index}.image`, '')}
                                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <ImageIcon size={24} className="text-gray-200" />
                          )}
                        </div>

                        {/* Input area */}
                        <div className="flex-1 w-full space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Option A: Gallery Upload */}
                            <label className="flex items-center justify-center gap-2 p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-primary hover:border-orange-500 transition-all group">
                              <Plus
                                size={18}
                                className="text-gray-400 group-hover:text-orange-500"
                              />
                              <span className="text-xs font-bold text-gray-500 group-hover:text-orange-600">
                                From Gallery
                              </span>

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  const files = [...imageFiles];
                                  files[index] = file;
                                  setImageFiles(files);

                                  // Preview only
                                  setValue(`products.${index}.image`, URL.createObjectURL(file));

                                  // Debug info
                                  console.log('Selected image:', {
                                    name: file.name,
                                    size: file.size,
                                    type: file.type,
                                  });
                                }}
                              />
                            </label>

                            {/* Option B: URL Input */}
                            <div className="relative">
                              <LinkIcon
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <input
                                {...register(`products.${index}.image` as const)}
                                placeholder="Paste Image URL..."
                                className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-orange-200"
                                // This ensures manual typing also updates the preview
                              />
                            </div>
                          </div>
                          <p className="text-[9px] text-gray-400 font-medium ml-1">
                            *Upload a file from your device or paste a direct link to an image.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variations/Extras Sidebar */}
                  <div className="lg:col-span-5 bg-indigo-50/10 p-6 rounded-3xl border border-indigo-50">
                    <DynamicExtras nestIndex={index} control={control} register={register} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-6 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 shadow-2xl flex flex-col items-stretch gap-6 z-20">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 text-left">
                <label className="text-[10px] font-black text-gray-400 mb-1 block ml-2 tracking-widest uppercase">
                  Post-Action
                </label>
                <select
                  {...register('dealAction')}
                  className="w-full p-4 bg-gray-100 border-none rounded-2xl font-bold text-gray-600 outline-none cursor-pointer appearance-none"
                >
                  <option value="new">Save and create a combined Deal</option>
                  <option value="existing">Save to Catalog Only</option>
                </select>
              </div>

              {watchDealAction === 'new' && (
                <div className="flex-1 text-left animate-in slide-in-from-left-4 duration-300">
                  <label className="text-[10px] font-black text-gray-400 mb-1 block ml-2 tracking-widest uppercase">
                    Name Your New Deal
                  </label>
                  <div className="relative">
                    <Edit3 size={18} className="absolute left-4 top-5 text-black" />
                    <input
                      {...register('dealName')}
                      placeholder="e.g. Weekend Special Combo"
                      className="w-full p-4 pl-12 bg-orange-50/50 border border-orange-100 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#ff5a00]/20"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 w-full md:w-64 bg-primary text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-sm tracking-widest hover:bg-[#e65100]"
                >
                  <ShoppingBag size={22} /> Save All Items
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Category Creator Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-gray-100 text-left">
            <h3 className="text-xl font-black mb-1 text-gray-900 tracking-tight uppercase">
              Create Category
            </h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
              Add a unique category to your list
            </p>

            <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Seafood"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-black font-bold text-gray-700 mb-6"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCatModal(false);
                  setNewCatName('');
                }}
                className="flex-1 py-4 text-gray-500 font-bold bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const trimmed = newCatName.trim();
                  if (trimmed && !customCategories.includes(trimmed)) {
                    setCustomCategories((prev) => [...prev, trimmed].sort());
                    setNewCatName('');
                    setShowCatModal(false);
                    setToast({ msg: 'New category added!', type: 'success' });
                  } else {
                    setToast({ msg: 'Category already exists or is empty', type: 'error' });
                  }
                }}
                className="flex-1 py-4 bg-black text-white rounded-2xl font-black shadow-lg hover:bg-gray-800 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;
