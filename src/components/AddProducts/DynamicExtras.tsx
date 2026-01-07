import React, { useEffect } from 'react';
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { type Product } from '../../types';
import axiosInstance from '../../api/axiosInstance';

interface DynamicExtrasProps {
  nestIndex: number;
  control: Control<{ products: Product[]; dealAction: 'existing' | 'new' }>;
  register: UseFormRegister<{ products: Product[]; dealAction: 'existing' | 'new' }>;
  onExtraAdded?: () => void; // callback to refresh OptionsList
}

export const DynamicExtras: React.FC<DynamicExtrasProps> = ({
  nestIndex,
  control,
  register,
  onExtraAdded,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `products.${nestIndex}.extras` as const,
  });

  // Auto-save newly added extras
  useEffect(() => {
    fields.forEach(async (field) => {
      if (!field._saved && field.name.trim() !== '') {
        try {
          await axiosInstance.post('/options', { name: field.name, price: 0, linkedProductNames: [] });
          field._saved = true; // mark as saved to prevent duplicate requests
          if (onExtraAdded) onExtraAdded();
        } catch (err) {
          console.error('Failed to save extra:', err);
        }
      }
    });
  }, [fields, onExtraAdded]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-primary uppercase tracking-widest">
          Extras & Add-ons
        </label>
        <button
          type="button"
          onClick={() => append({ name: '', _saved: false })} // mark new extras as unsaved
          className="flex cursor-pointer items-center gap-1 text-[10px] font-bold bg-primary hover:bg-[#e65100] text-white px-2 py-1 rounded-md  transition-colors"
        >
          <Plus size={12} /> Add Extra
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, k) => (
          <div
            key={field.id}
            className="flex items-center bg-white border border-indigo-100 rounded-lg p-2 pr-2 shadow-sm animate-in zoom-in-95"
          >
            <input
              {...register(`products.${nestIndex}.extras.${k}.name` as const)}
              placeholder="e.g. Cheese"
              className="text-xs font-medium bg-transparent outline-none px-2 w-20 text-[#ff772e] placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => remove(k)}
              className="text-indigo-300 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-[10px] text-gray-400 italic">No extras added yet.</p>
        )}
      </div>
    </div>
  );
};
