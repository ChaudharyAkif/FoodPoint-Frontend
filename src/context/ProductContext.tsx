import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

interface BaseItem {
  _id: string;
  price: number;
  image?: string;
  description?: string;
  type: 'product' | 'deal';
  name: string;
  category?: string;
  dietaryInfo?: {
    isVegan?: boolean;
    isVegetarian?: boolean;
    isSpicy?: boolean;
  };
}

interface ProductContextType {
  allItems: BaseItem[];
  deals: any[];
  products: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Fetch deals
      const dealsRes = await axiosInstance.get('/deals');
      console.log(dealsRes);
      // setDeals(dealsRes?.data?.filter((deal: any) => deal.status === 'active'));
    } catch (error) {
      console.error('Error fetching deals:', error);
    }

    try {
      // Fetch products
      const productsRes = await axiosInstance.get('/products');
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Normalize data within the context
  const allItems: BaseItem[] = [
    ...deals.map((d) => ({
      ...d,
      type: 'deal' as const,
      name: d.dealName,
      category: 'Deals',
      dietaryInfo: d.dietaryInfo || { isVegan: false, isVegetarian: false, isSpicy: false },
    })),
    ...products.map((p) => ({
      ...p,
      type: 'product' as const,
      name: p.productName,
    })),
  ];

  return (
    <ProductContext.Provider value={{ allItems, deals, products, loading, refreshData: fetchData }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
