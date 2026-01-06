import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, Link, MoreVertical, Trash2, Info, AlertTriangle } from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';
import axiosInstance from '../../api/axiosInstance';

interface OptionGroup {
  _id: string;
  name: string;
  isRequired: boolean;
  options: any[];
  linkedProductNames: string[];
}

export const OptionGroupList: React.FC = () => {
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', name: '' });

  // ✅ FIXED HERE: HTMLDivElement → HTMLElement
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const fetchGroups = useCallback(async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/option-groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const grouped = groups.reduce(
    (acc, grp) => {
      const letter = grp.name.charAt(0).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(grp);
      return acc;
    },
    {} as Record<string, OptionGroup[]>
  );

  const scrollToSection = (letter: string) => {
    const element = sectionRefs.current.get(letter);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/option-groups/${deleteModal.id}`);
      setDeleteModal({ isOpen: false, id: '', name: '' });
      fetchGroups();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative text-left">
      {isCreateModalOpen && (
        <CreateGroupModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchGroups}
        />
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Delete Group?
            </h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Remove <span className="font-bold text-gray-800">"{deleteModal.name}"</span>?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="cursor-pointer w-full py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Confirm Delete
              </button>
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, id: '', name: '' })
                }
                className="cursor-pointer w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl hover:bg-gray-800 transition-all"
            >
              <Plus size={18} /> Create new
            </button>
          </div>

          {Object.entries(grouped)
            .sort()
            .map(([letter, items]) => (
              <section
                key={letter}
                ref={(el) => {
                  if (el) sectionRefs.current.set(letter, el);
                }}
                className="text-left scroll-mt-24"
              >
                <h4 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-tight">
                  {letter}
                </h4>

                <div className="space-y-6">
                  {items.map((group) => (
                    <div
                      key={group._id}
                      className="p-6 border border-gray-100 rounded-[2rem] bg-white hover:shadow-xl transition-all relative"
                    >
                      <div className="flex justify-between items-start text-left">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-lg tracking-tight">
                              {group.name}
                            </p>
                            {group.isRequired && (
                              <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-1.5 py-0.5 rounded uppercase">
                                Required
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 font-medium mt-1">
                            {group.options.map((opt: any) => opt.name).join(', ')}
                          </p>

                          {group.linkedProductNames?.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-2.5 w-fit border border-gray-100">
                              <Link size={14} className="text-gray-400 rotate-45" />
                              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                                Linked to {group.linkedProductNames[0]}
                                {group.linkedProductNames.length > 1
                                  ? ` (${group.linkedProductNames.length - 1} more)`
                                  : ''}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === group._id ? null : group._id
                            );
                          }}
                          className="p-2 text-gray-300 hover:text-gray-900 rounded-full cursor-pointer transition-colors"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === group._id && (
                          <div className="absolute right-6 top-16 w-44 bg-white border border-gray-100 shadow-2xl rounded-2xl z-10 py-2">
                            <button className="flex gap-2 w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                              <Info size={14} className="text-indigo-500" />
                              View details
                            </button>
                            <button
                              onClick={() => {
                                setDeleteModal({
                                  isOpen: true,
                                  id: group._id,
                                  name: group.name,
                                });
                                setOpenMenuId(null);
                              }}
                              className="flex gap-2 w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
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
