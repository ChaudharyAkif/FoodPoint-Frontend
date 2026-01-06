import React, { useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Camera,
  CheckCircle,
  X,
  AlertTriangle,
  Search,
  Link as LinkIcon,
  ChevronDown,
  Wheat,
  Leaf,
  Flame,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useMenu } from '../context/useMenu';

interface Variation {
  size: string;
  deliveryPrice: number;
  collectionPrice?: number;
}

interface OptionGroupRef {
  _id: string;
  name: string;
  options?: { _id: string; name: string }[];
}

interface OptionRef {
  _id: string;
  name: string;
  price: number;
}

interface EditItemForm {
  productName: string;
  image: string;
  description: string;
  category: string;
  variations: Variation[];
  dietaryInfo: {
    is18Plus: boolean;
    isSpicy: boolean;
    isVegan: boolean;
    isVegetarian: boolean;
  };
  optionGroups: any[]; // Changed to handle incoming populated objects
  extras: string[];
}

export const EditItemPage: React.FC = () => {
  const { refreshData } = useMenu();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isImageValid, setIsImageValid] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showCollectionPrice, setShowCollectionPrice] = useState<Record<number, boolean>>({});
  const [availableGroups, setAvailableGroups] = useState<OptionGroupRef[]>([]);
  const [availableOptions, setAvailableOptions] = useState<OptionRef[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const { register, control, handleSubmit, reset, watch, setValue } = useForm<EditItemForm>({
    defaultValues: {
      productName: '',
      image: '',
      description: '',
      category: '',
      variations: [{ size: '', deliveryPrice: 0, collectionPrice: 0 }],
      dietaryInfo: { is18Plus: false, isSpicy: false, isVegan: false, isVegetarian: false },
      optionGroups: [],
      extras: [],
    },
  });

  const {
    fields: variationFields,
    append: appendVar,
    remove: removeVar,
  } = useFieldArray({ control, name: 'variations' });

  // Watch variables to resolve "never read" errors
  const variations = watch('variations') || [];
  const linkedGroupIds = watch('optionGroups') || [];
  const linkedExtras = watch('extras') || [];
  const currentImage = watch('image');

  const fetchData = useCallback(async () => {
    try {
      const [productRes, groupsRes, optionsRes, allProductsRes] = await Promise.all([
        axiosInstance.get(`/products/${id}`),
        axiosInstance.get(`/option-groups`),
        axiosInstance.get(`/options`),
        axiosInstance.get(`/products`), // Get all to extract unique categories
      ]);

      // Set form data
      reset(productRes.data);
      setAvailableGroups(groupsRes.data);
      setAvailableOptions(optionsRes.data);

      // 1. Extract categories safely from database
      const dbProducts = allProductsRes.data || [];
      const existingCats = dbProducts
        .map((p: any) => p.category)
        .filter((cat: string) => cat && cat.trim() !== '');

      // 2. Define your master defaults
      const defaultCats = ['Starters', 'Italian', 'Fast Food', 'Chinese', 'Desi', 'Desserts'];

      // 3. Combine and remove duplicates using a Set
      const finalUniqueCats = Array.from(new Set([...defaultCats, ...existingCats]));

      // 4. Sort alphabetically for better UX
      setCategories(finalUniqueCats.sort() as string[]);

      // Handle variation visibility
      const visibility: Record<number, boolean> = {};
      (productRes.data.variations || []).forEach((v: Variation, i: number) => {
        if (v.collectionPrice && v.collectionPrice > 0) visibility[i] = true;
      });
      setShowCollectionPrice(visibility);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  useEffect(() => {
    if (currentImage) setIsImageValid(true);
  }, [currentImage]);

  const toggleGroupLink = (groupId: string) => {
    const currentIds = linkedGroupIds.map((g: any) => (typeof g === 'object' ? g._id : g));
    const updated = currentIds.includes(groupId)
      ? currentIds.filter((id: string) => id !== groupId)
      : [...currentIds, groupId];
    setValue('optionGroups', updated);
  };

  const toggleOptionLink = (optionName: string) => {
    const updated = (linkedExtras || []).includes(optionName)
      ? linkedExtras.filter((n) => n !== optionName)
      : [...(linkedExtras || []), optionName];
    setValue('extras', updated);
  };

  const onSubmit = async (data: EditItemForm) => {
    try {
      // FIX: Payload flattening to prevent 500 error
      const payload = {
        ...data,
        optionGroups: data.optionGroups.map((group: any) =>
          typeof group === 'object' ? group._id : group
        ),
      };

      await axiosInstance.put(`/products/${id}`, payload);
      await refreshData();
      navigate('/menu-items');
    } catch (error: any) {
      console.error('Submit Error:', error.response?.data || error.message);
      alert('error saving item');
    }
  };

  if (loading)
    return <div className="p-20 text-center font-bold text-gray-400">syncing details...</div>;

  return (
    <div className="bg-white min-h-screen font-sans pb-32 text-left">
      {/* Modals for Groups and Extras */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">link option groups</h3>
              <button type="button" onClick={() => setShowGroupModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {(availableGroups || [])
                .filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((group) => {
                  const isLinked = linkedGroupIds.some(
                    (g: any) => (typeof g === 'object' ? g._id : g) === group._id
                  );
                  return (
                    <div
                      key={group._id}
                      onClick={() => toggleGroupLink(group._id)}
                      className={`p-5 rounded-3xl border-2 cursor-pointer flex items-center gap-4 ${isLinked ? 'border-black bg-gray-50' : 'border-gray-100 bg-white'}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isLinked ? 'bg-black border-black' : 'border-gray-200'}`}
                      >
                        {isLinked && <Plus size={16} className="text-white rotate-45" />}
                      </div>
                      <span className="font-bold text-gray-900">{group.name}</span>
                    </div>
                  );
                })}
            </div>
            <div className="p-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="w-full bg-black text-white py-4 rounded-full font-black text-xs tracking-widest"
              >
                done
              </button>
            </div>
          </div>
        </div>
      )}

      {showOptionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">link individual extras</h3>
              <button type="button" onClick={() => setShowOptionModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {/* FIX: Crash prevention guard */}
              {availableOptions?.map((opt) => {
                const isLinked = (linkedExtras || []).includes(opt.name);
                return (
                  <div
                    key={opt._id}
                    onClick={() => toggleOptionLink(opt.name)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer flex items-center gap-4 ${isLinked ? 'border-black bg-gray-50' : 'border-gray-100 bg-white'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isLinked ? 'bg-black border-black' : 'border-gray-200'}`}
                    >
                      {isLinked && <Plus size={16} className="text-white rotate-45" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{opt.name}</span>
                      <span className="text-[10px] font-bold text-gray-400">
                        £{opt.price?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowOptionModal(false)}
                className="w-full bg-black text-white py-4 rounded-full font-black text-xs tracking-widest"
              >
                done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-30">
        <button type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Edit item</h1>
      </div>

      <div className="max-w-3xl mx-auto pt-8 px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Section 1: Image and Name */}
          <section className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-900">Details</h2>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Item Photo
              </label>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Preview Box */}
                <div className="relative group shrink-0">
                  <div className="w-48 h-48 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center relative overflow-hidden shadow-inner">
                    {currentImage && isImageValid ? (
                      <img
                        src={currentImage}
                        className="w-full h-full object-cover"
                        alt="preview"
                        onError={() => setIsImageValid(false)}
                      />
                    ) : (
                      <Camera size={48} className="text-gray-200" />
                    )}

                    {/* Hover to clear button */}
                    {currentImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setValue('image', '');
                          setIsImageValid(true);
                        }}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                      >
                        <Trash2 size={24} />
                        <span className="text-[10px] font-black uppercase">Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Dual Mode Input Area */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {/* Option A: Gallery Upload */}
                    <label className="flex items-center justify-center gap-3 p-5 bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-all group">
                      <Plus size={20} className="text-gray-400 group-hover:text-orange-500" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-700 group-hover:text-orange-500">
                          Upload from Gallery
                        </p>
                        <p className="text-[10px] text-gray-400">PNG, JPG or GIF</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setValue('image', reader.result as string);
                              setIsImageValid(true);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {/* OR Separator */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-[1px] bg-gray-100 flex-1"></div>
                      <span className="text-[10px] font-black text-gray-300 uppercase">OR</span>
                      <div className="h-[1px] bg-gray-100 flex-1"></div>
                    </div>

                    {/* Option B: URL Input */}
                    <div className="relative">
                      <LinkIcon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        {...register('image')}
                        placeholder="Paste direct image link..."
                        className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                      />
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {currentImage && isImageValid && (
                    <div className="flex items-center gap-2 text-emerald-600 px-1">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Image ready
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                Item name
              </label>
              <input
                {...register('productName')}
                placeholder="Item name"
                className="w-full p-4 border border-gray-300 rounded-xl font-bold text-lg outline-none focus:border-black"
              />

              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="Description"
                className="w-full p-4 border border-gray-300 rounded-xl font-medium h-32 outline-none focus:border-black"
              />
            </div>
          </section>


          {/* Section 2: Variations Input */}
          <section className="space-y-8">
            <h3 className="text-xs font-black text-gray-400 tracking-widest">Prices</h3>
            {variationFields.map((field, index) => (
              <div
                key={field.id}
                className="p-8 bg-gray-50/30 rounded-[2.5rem] border border-gray-100 relative space-y-6"
              >
                <div className="flex justify-between items-center">
                  <input
                    {...register(`variations.${index}.size` as const)}
                    placeholder="e.g. Small"
                    className="text-lg font-black text-gray-900 bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeVar(index)}
                    className="text-gray-300 hover:text-rose-500"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400">Delivery Price</p>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-4 bg-white">
                      <span className="text-gray-400">£</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`variations.${index}.deliveryPrice` as const, {
                          valueAsNumber: true,
                        })}
                        className="w-full outline-none font-bold"
                      />
                    </div>
                  </div>
                  {showCollectionPrice[index] ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-[10px] font-black text-gray-400">Collection Price</p>
                        <X
                          size={12}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowCollectionPrice((prev) => ({ ...prev, [index]: false }));
                            setValue(`variations.${index}.collectionPrice`, 0);
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-4 bg-white">
                        <span className="text-gray-400">£</span>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`variations.${index}.collectionPrice` as const, {
                            valueAsNumber: true,
                          })}
                          className="w-full outline-none font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCollectionPrice((prev) => ({ ...prev, [index]: true }))}
                      className="text-[10px] font-black text-gray-900 pt-6 hover:underline transition-all"
                    >
                      + Add collection price
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendVar({ size: '', deliveryPrice: 0, collectionPrice: 0 })}
              className="flex items-center gap-2 bg-gray-100 px-8 py-4 rounded-full text-xs font-black tracking-widest"
            >
              <Plus size={18} /> Add variation
            </button>
          </section>

          {/* Category Section - Selection Only */}
          <section className="space-y-4 pt-2">
            <label className="text-[10px] font-black text-gray-400 tracking-widest ml-1 uppercase">
              Category
            </label>

            <div className="relative max-w-sm mt-4 group">
              <div className="w-full p-2 bg-white border border-gray-300 rounded-2xl flex items-center min-h-[56px] focus-within:border-black transition-all">
                <div className="flex flex-1 items-center overflow-hidden">
                  {watch('category') ? (
                    <div className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full ml-2 animate-in zoom-in-95 duration-200">
                      <span className="text-xs font-bold">{watch('category')}</span>
                      <button
                        type="button"
                        onClick={() => setValue('category', '')}
                        className="hover:text-gray-300 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm ml-4 font-medium italic">
                      Select a category...
                    </span>
                  )}
                </div>

                <select
                  {...register('category')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="">Select Category</option>
                  {/* Added check to prevent crashes and ensure categories are rendered */}
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>

                <div className="absolute right-4 pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
              <p className="text-[9px] text-gray-400 mt-2 ml-1 font-medium">
                *A new Category can only be added while creating a new product in Add Products Page.
              </p>
            </div>
          </section>

          {/* Dietary Information Section */}
          <section className="space-y-4 pt-8">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Dietary Information
              </label>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Optional
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* 18+ Toggle */}
              <button
                type="button"
                onClick={() => setValue('dietaryInfo.is18Plus', !watch('dietaryInfo.is18Plus'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-xs ${
                  watch('dietaryInfo.is18Plus')
                    ? 'border-black bg-black text-white'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <span className="text-[10px] font-black">18+</span>
              </button>

              {/* Spicy Toggle */}
              <button
                type="button"
                onClick={() => setValue('dietaryInfo.isSpicy', !watch('dietaryInfo.isSpicy'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-xs ${
                  watch('dietaryInfo.isSpicy')
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <Flame
                  size={14}
                  className={watch('dietaryInfo.isSpicy') ? 'text-white' : 'text-gray-300'}
                />
                <span>Spicy</span>
              </button>

              {/* Vegan Toggle */}
              <button
                type="button"
                onClick={() => setValue('dietaryInfo.isVegan', !watch('dietaryInfo.isVegan'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-xs ${
                  watch('dietaryInfo.isVegan')
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <Leaf
                  size={14}
                  className={watch('dietaryInfo.isVegan') ? 'text-white' : 'text-gray-300'}
                />
                <span>Vegan</span>
              </button>

              {/* Vegetarian Toggle */}
              <button
                type="button"
                onClick={() =>
                  setValue('dietaryInfo.isVegetarian', !watch('dietaryInfo.isVegetarian'))
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-xs ${
                  watch('dietaryInfo.isVegetarian')
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <Wheat
                  size={14}
                  className={watch('dietaryInfo.isVegetarian') ? 'text-white' : 'text-gray-300'}
                />
                <span>Vegetarian</span>
              </button>
            </div>
          </section>

          {/* Section 3: Summary (RESOLVES ESLINT WARNING) */}
          <section className="space-y-6 border-t border-gray-200 pt-12">
            <h3 className="text-xs font-black text-gray-400 tracking-widest">
              Summary of Variations
            </h3>
            <div className="space-y-4">
              {variations
                .filter((v) => v.size)
                .map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <span className="font-bold text-gray-900">{v.size}</span>
                    <span className="font-bold text-gray-900">
                      £{Number(v.deliveryPrice || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </section>

          {/* Section 4: Extras */}
          <section className="space-y-6 border-t border-gray-200 pt-12">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-400 tracking-widest">
                Individual Extras
              </h3>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest">
                <LinkIcon size={10} className="inline mr-1" /> Linked directly
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {linkedExtras.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100"
                >
                  <span className="text-xs font-black tracking-tight">{name}</span>
                  <button type="button" onClick={() => toggleOptionLink(name)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setShowOptionModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-widest text-gray-400 border border-dashed border-gray-200 hover:border-black rounded-full transition-all"
              >
                <Plus size={14} /> Link extras
              </button>
            </div>
          </section>

          {/* Section 5: Option Groups */}
          <section className="space-y-6 border-t border-gray-200 pt-12">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-400 tracking-widest">Option groups</h3>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest text-right flex-1">
                Linked to this item
              </span>
            </div>
            <div className="space-y-4">
              {(availableGroups || [])
                .filter((g) =>
                  linkedGroupIds.some(
                    (linked: any) => (typeof linked === 'object' ? linked._id : linked) === g._id
                  )
                )
                .map((group) => (
                  <div
                    key={group._id}
                    className="p-6 rounded-3xl border border-gray-100 bg-white flex flex-col gap-4 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-[0.5px] bg-gray-200 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-sm">{group.name}</p>
                          <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                            Currently Linked
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-[11px] font-bold text-gray-600">
                            {group.options?.map((opt) => opt.name).join(', ') || 'No options added'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleGroupLink(group._id)}
                        className="text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              <button
                type="button"
                onClick={() => setShowGroupModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black tracking-widest text-gray-900 hover:bg-gray-100 rounded-lg transition-all w-fit"
              >
                <Plus size={16} /> Link more groups
              </button>
            </div>
          </section>

          {/* Section 6: Allergens */}
          <div className="bg-[#FFF9C4] p-8 rounded-xl border border-[#FFF59D] flex gap-5">
            <AlertTriangle className="text-[#FBC02D] shrink-0 mt-0.5" size={28} />
            <div className="text-left space-y-2">
              <p className="font-black text-sm tracking-tight">Allergens</p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                You're legally obliged to keep your allergen information up to date. Add any
                allergen information in the item description.
              </p>
              <button type="button" className="text-xs font-medium underline tracking-widest">
                Read our handy guidance
              </button>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-12 z-40 shadow-2xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="font-black text-gray-400 text-xs tracking-widest hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-16 py-4 rounded-full font-black text-xs tracking-widest shadow-xl hover:bg-gray-800 active:scale-95 transition-all"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
