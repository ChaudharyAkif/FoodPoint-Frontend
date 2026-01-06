import { useMemo } from 'react';
import { DealGallery } from '../components/MenuItems/DealGallery';
import { ProductSelection } from '../components/MenuItems/ProductSelection';
import { useMenu } from '../context/useMenu'; 

export const MenuItemsPage = () => {
  // 2. UPDATED: Removed local useState for deals
  // 3. UPDATED: Removed local fetchDeals and useEffect hooks
  // 4. UPDATED: Pull global state and refresh function from Context
  const { deals, refreshData, loading } = useMenu();

  // Logic: Sort deals so the newest appear first
  const sortedDeals = useMemo(() => {
    // 5. UPDATED: Check if deals exist before sorting to prevent errors during initial load
    // if (!deals) return [];
    if (!deals || !Array.isArray(deals)) return []
    return [...deals].sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Newest first
    });
  }, [deals]);

  // 6. UPDATED: Added a global loading state handler
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="font-bold text-gray-400 animate-pulse uppercase tracking-widest">
          Syncing Menu Data...
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative border border-gray-100 rounded-3xl p-6 md:p-8 bg-white shadow-sm space-y-8">
          {/* 7. UPDATED: Pass global refreshData function instead of local fetchDeals */}
          <DealGallery deals={sortedDeals} onRefresh={refreshData} />
          
          <ProductSelection onDealCreated={refreshData} />
        </div>
      </div>
    </div>
  );
};