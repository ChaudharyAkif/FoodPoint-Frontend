import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getToken } from '../context/AuthContext';

interface MenuContextType {
  products: any[];
  deals: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (showLoader = false) => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (showLoader) setLoading(true);

      const [prodRes, dealRes] = await Promise.all([
        axiosInstance.get('/products'),
        axiosInstance.get('/deals'),
      ]);

      const prodData = Array.isArray(prodRes.data)
        ? prodRes.data
        : prodRes.data?.data ?? [];

      const dealData = Array.isArray(dealRes.data)
        ? dealRes.data
        : dealRes.data?.data ?? [];

      setProducts(prodData);
      setDeals(dealData);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);

    const interval = setInterval(() => {
      fetchData(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const refreshData = async () => {
    await fetchData(false);
  };

  return (
    <MenuContext.Provider
      value={{
        products,
        deals,
        loading,
        refreshData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};