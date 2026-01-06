import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartIconProps {
  cartCount: number;
  onNavigateToCart: () => void;
}

const FloatingCartIcon = ({ cartCount, onNavigateToCart }: FloatingCartIconProps) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Check role from localStorage directly to avoid hook issues
    const role = localStorage.getItem('role');
    
    // Hide for cashier or superadmin
    if (role === 'cashier' || role === 'superadmin') {
      setShouldShow(false);
    } else {
      setShouldShow(true);
    }
  }, []);

  // Don't show if not allowed by role
  if (!shouldShow) {
    return null;
  }

  // Don't show if cart is empty
  if (cartCount === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.button
        onClick={onNavigateToCart}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full p-5 shadow-2xl hover:shadow-red-500/50 transition-all duration-300 group"
      >
        {/* Pulsing ring effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-red-500"
        />
        
        {/* Cart Icon */}
        <ShoppingCart className="w-7 h-7 relative z-10" />
        
        {/* Badge with count */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cartCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white"
          >
            <motion.span
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {cartCount}
            </motion.span>
          </motion.div>
        </AnimatePresence>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-xl">
            View Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})
            <div className="absolute top-full right-6 -mt-1">
              <div className="border-8 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingCartIcon;