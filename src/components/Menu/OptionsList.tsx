import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, Link, MoreVertical, Trash2, Info, AlertTriangle, Search } from 'lucide-react';
import { CreateOptionModal } from './CreateOptionModal';
import axiosInstance from '../../api/axiosInstance';

interface Option {
  _id: string;
  name: string;
  price: number;
  linkedProductNames: string[];
}

export const OptionsList: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const fetchOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/options');
      setOptions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filteredOptions.reduce((acc, opt) => {
    const letter = opt.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(opt);
    return acc;
  }, {} as Record<string, Option[]>);

  const scrollToSection = (letter: string) => {
    const element = sectionRefs.current.get(letter);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/options/${deleteModal.id}`);
      setDeleteModal({ isOpen: false, id: '', name: '' });
      fetchOptions();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {isCreateModalOpen && (
        <CreateOptionModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchOptions}
        />
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <div className="w-20 h-20 bg-rose-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Option?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Remove <span className="font-bold text-gray-800">"{deleteModal.name}"</span>?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-rose-100 hover:bg-orange-600 transition-all"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold uppercase text-xs hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-12 items-start">
        <div className="sticky top-32 w-32 shrink-0 text-left">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
            Jump to section
          </p>
          <div className="flex flex-col gap-3">
            {Object.keys(grouped)
              .sort()
              .map((letter) => (
                <button
                  key={letter}
                  onClick={() => scrollToSection(letter)}
                  className="text-sm font-black text-gray-400 hover:text-orange-500 transition-colors uppercase"
                >
                  {letter}
                </button>
              ))}
          </div>
        </div>

        <div className="flex-1 space-y-12">
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search for options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 font-medium text-sm outline-none focus:ring-2 focus:ring-gray-100 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <Search size={18} />
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl hover:bg-gray-800 transition-all"
            >
              <Plus size={18} /> Create new
            </button>
          </div>

          {isLoading && (
            <div className="p-20 text-center font-bold text-gray-400 animate-pulse">
              Syncing options...
            </div>
          )}

          {!isLoading &&
            Object.entries(grouped)
              .sort()
              .map(([letter, items]) => (
                <section
                  key={letter}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(letter, el as HTMLDivElement);
                  }}
                  className="text-left scroll-mt-24"
                >
                  <h4 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-tight">
                    {letter}
                  </h4>
                  <div className="space-y-6">
                    {items.map((opt) => (
                      <div
                        key={opt._id}
                        className="p-6 border border-gray-100 rounded-[2rem] bg-white hover:shadow-xl transition-all relative text-left group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-left">
                            <p className="font-bold text-gray-900 text-lg tracking-tight">{opt.name}</p>
                            <p className="text-sm text-gray-400 font-bold mt-1">
                              {opt.price === undefined || opt.price === null || opt.price === 0
                                ? 'Free'
                                : `£${Number(opt.price).toFixed(2)}`}
                            </p>

                            {opt.linkedProductNames && opt.linkedProductNames.length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-2.5 w-fit border border-gray-100">
                                <Link size={14} className="text-gray-400 rotate-45" />
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                                  Linked to {opt.linkedProductNames[0]}{' '}
                                  {opt.linkedProductNames.length > 1 ? `(${opt.linkedProductNames.length - 1} more)` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === opt._id ? null : opt._id);
                            }}
                            className="p-2 text-gray-300 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {openMenuId === opt._id && (
                            <div className="absolute right-6 top-16 w-44 bg-white border border-gray-100 shadow-2xl rounded-2xl z-10 py-2 animate-in slide-in-from-top-2 duration-200">
                              <button className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                <Info size={14} className="text-indigo-500" /> View details
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteModal({ isOpen: true, id: opt._id, name: opt.name });
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
        </div>
      </div>
    </div>
  );
};
