import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

interface BaseItem {
  _id: string;
  price: number;
  image?: string;
  description?: string;
  type: "product" | "deal";
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
  deals: BaseItem[];
  products: BaseItem[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<BaseItem[]>([]);
  const [products, setProducts] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch deals
      const dealsRes = await axiosInstance.get("/deals");
      if (typeof dealsRes.data === "string" && dealsRes.data.startsWith("<!DOCTYPE html>")) {
        throw new Error("Invalid response from API (HTML received). Check your ngrok URL!");
      }

      setDeals(
        dealsRes.data.map((d: any) => ({
          ...d,
          type: "deal" as const,
          name: d.dealName,
          category: "Deals",
          dietaryInfo: d.dietaryInfo || { isVegan: false, isVegetarian: false, isSpicy: false },
        }))
      );
    } catch (err: any) {
      console.error("Error fetching deals:", err);
      setError(err.message || "Failed to fetch deals");
    }

    try {
      // Fetch products
      const productsRes = await axiosInstance.get("/products");
      if (typeof productsRes.data === "string" && productsRes.data.startsWith("<!DOCTYPE html>")) {
        throw new Error("Invalid response from API (HTML received). Check your ngrok URL!");
      }

      setProducts(
        productsRes.data.map((p: any) => ({
          ...p,
          type: "product" as const,
          name: p.productName,
        }))
      );
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError((prev) => prev ? prev + "; " + (err.message || "Failed to fetch products") : err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const allItems: BaseItem[] = [...deals, ...products];

  return (
    <ProductContext.Provider value={{ allItems, deals, products, loading, error, refreshData: fetchData }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
