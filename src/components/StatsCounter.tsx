// src/components/StatsCounter.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const StatsCounter: React.FC = () => {
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const ordersRes = await axiosInstance.get('/orders');
      const totalOrders = ordersRes.data.length;
      const totalRevenue = ordersRes.data.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
      
      setOrders(totalOrders);
      setRevenue(totalRevenue);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const animateCounter = (endValue: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const duration = 2000;
    const steps = 60;
    const stepValue = endValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= endValue) {
        setter(endValue);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, duration / steps);
  };

  useEffect(() => {
    if (orders > 0) animateCounter(orders, setOrders);
    if (revenue > 0) animateCounter(revenue, setRevenue);
  }, [orders, revenue]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
        <div className="text-4xl font-bold text-red-500 mb-2">
          {orders.toLocaleString()}
        </div>
        <div className="text-gray-600">Orders Delivered</div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
        <div className="text-4xl font-bold text-red-500 mb-2">
          ${revenue.toLocaleString()}
        </div>
        <div className="text-gray-600">Total Revenue</div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
        <div className="text-4xl font-bold text-red-500 mb-2">4.8</div>
        <div className="text-gray-600">Customer Rating</div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
        <div className="text-4xl font-bold text-red-500 mb-2">30</div>
        <div className="text-gray-600">Min Avg Delivery</div>
      </div>
    </div>
  );
};