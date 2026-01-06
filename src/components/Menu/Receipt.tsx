import React from 'react';
import { type CartItem } from '../../types/cart'; // Adjust path to your types

interface ReceiptProps {
  items: CartItem[];
  total: number;
  orderId?: string;
  date?: string;
  format: 'thermal' | 'a4';
}

// We use forwardRef so the printing library can access this component
export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>((props, ref) => {
  const { items, total, orderId, date, format } = props;

  // STYLES: 80mm Thermal vs Standard A4
  const isThermal = format === 'thermal';

  return (
    <div ref={ref} className={`bg-white text-black font-mono p-4 ${isThermal ? 'w-[80mm] text-[12px]' : 'w-full max-w-2xl text-base'}`}>
      
      {/* HEADER */}
      <div className="text-center mb-4 border-b border-black pb-2">
        <h1 className={`${isThermal ? 'text-lg' : 'text-2xl'} font-bold uppercase`}>Paddock Fish Bar</h1>
        <p>203 Church Street, HD1 4UL</p>
        <p>Tel: +44 1234 567890</p>
      </div>

      {/* META INFO */}
      <div className="mb-4">
        <p><strong>Order #:</strong> {orderId || 'New'}</p>
        <p><strong>Date:</strong> {date || new Date().toLocaleString()}</p>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full mb-4 text-left border-collapse">
        <thead>
          <tr className="border-b border-black border-dashed">
            <th className="py-1 w-8">Qty</th>
            <th className="py-1">Item</th>
            <th className="py-1 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200 border-dashed">
              <td className="py-1 align-top">{item.quantity}</td>
              <td className="py-1 align-top">
                {item.name}
                {/* Show variation if it exists */}
                {/* {item.selectedVariation && <div className="text-[10px] text-gray-500">({item.selectedVariation})</div>} */}
              </td>
              <td className="py-1 text-right align-top">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="border-t-2 border-black pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {!isThermal && (
            <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax (10%):</span>
                <span>${(total * 0.10).toFixed(2)}</span>
            </div>
        )}
        <div className={`flex justify-between font-bold ${isThermal ? 'text-lg mt-2' : 'text-xl mt-4'}`}>
          <span>TOTAL:</span>
          <span>${(total * 1.10).toFixed(2)}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-6 pt-2 border-t border-black">
        <p className="font-bold">Thank you for dining with us!</p>
        <p className="text-[10px] mt-1">www.paddockfishbar.com</p>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";