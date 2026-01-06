import React, { useState } from 'react';
import { OptionsList } from '../components/Menu/OptionsList';
import { OptionGroupList } from '../components/Menu/OptionGroupList'; // Added Import
import { Globe, Info } from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'options'>('options');

  return (
    <div className='min-h-screen bg-gray-50/50 py-10 px-4 md:px-6'>
    <div className='max-w-5xl mx-auto'>
     <h1 className="text-2xl font-bold text-gray-900 mb-8 text-left tracking-tight">
          Your menu
        </h1>
    <div className="bg-white min-h-screen font-sans">
      {/* Top Publish Banner */}
      <div className="bg-neutral-100 p-6 rounded-lg border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <div className="text-left">
          <h3 className="font-bold text-gray-900 text-lg tracking-tight">
            Happy with all your changes?
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Make all your changes and Publish them to your customers.
            
          </p>
          <p className='flex mt-4'>
            <Info size={14} className="text-gray-600 mt-1 mr-2" /> 
             About menu changes
          </p>
        </div>
        <button className="bg-black text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-sm hover:bg-gray-800 transition-all active:scale-95">
          <Globe size={18} /> Publish
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8">
       

        {/* Navigation Tabs */}
        <div className="flex gap-10 border-b border-gray-100 mb-8">
          <button
            onClick={() => setActiveTab('groups')}
            className={`pb-4 text-sm font-bold tracking-widest transition-all ${
              activeTab === 'groups'
                ? 'border-b-4 border-orange-500 text-orange-500'
                : 'text-gray-400'
            }`}
          >
            Option groups
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`pb-4 text-sm font-bold tracking-widest transition-all ${
              activeTab === 'options'
                ? 'border-b-4 border-orange-500 text-orange-500'
                : 'text-gray-400'
            }`}
          >
            Options
          </button>
        </div>

        {/* Dynamic Content Switching */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'options' && <OptionsList />}
          {activeTab === 'groups' && <OptionGroupList />}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};
