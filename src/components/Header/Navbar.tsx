// src/components/Header/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import { checkRoleApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Import useCart

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart(); // Get cart count
  const navigate = useNavigate();

  // Fetch role whenever `user` changes
  useEffect(() => {
    const fetchUserRole = async () => {
      const email = user?.email;
      if (email) {
        try {
          const res = await checkRoleApi(email);
          setRole(res.data.role);
        } catch {
          setRole(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setRole(null);
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Logout handler
  const handleLogout = () => {
    logout();
    setRole(null);
    setOpen(false);
    navigate('/auth/login');
  };

  // Links based on role
  const links = [
    { name: 'Home', path: '/', roles: ['superadmin', 'cashier',] },
    { name: 'Add Products', path: '/dashboard/superadmin/add-products', roles: ['superadmin'] },
    { name: 'Menu/Items', path: '/menu-items', roles: ['superadmin' , 'cashier' ] },
    { name: 'Orders & invoices', path: '/orders', roles: ['superadmin', 'cashier' ] },
    { name: 'Menu Management', path: '/dashboard/superadmin/menu-management', roles: ['superadmin'] },
    { name: 'Login', path: '/auth/login', roles: ['guest'] },
    { name: 'Dashboard', path: '/dashboard/superadmin/details', roles: ['superadmin'] },
    { name: 'Analytics', path: '/analytic', roles: ['superadmin'] },
  ];

  const currentRole = role || 'guest';
  const filteredLinks = links.filter((link) => link.roles.includes(currentRole));

  // Cart button component (simple version)
  const CartButton = () => {
    const cartCount = getCartCount();
    
    return (
      <button
        onClick={() => navigate('/cart')}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ShoppingCart size={20} className="text-gray-700" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    );
  };

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200 w-full sticky top-0 z-50">
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-1.5 rounded-md">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-sm hidden sm:block">FoodPoint</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 w-full sticky top-0 z-50">
      <div className="px-6 md:px-8 h-16 flex items-center justify-between">
        {/* LEFT: Logo + Links */}
        <div className="flex items-center gap-8 h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-1.5 rounded-md">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-sm hidden sm:block">FoodPoint</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 h-full">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[13px] font-medium transition-colors flex items-center h-full border-b-2 ${
                    isActive
                      ? 'text-gray-900 border-orange-500'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* RIGHT: Cart Button + Logout + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Cart Button (Always visible for all roles) */}
          <CartButton />
          
          {role && role !== 'guest' && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-3">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Cart Link */}
          <button
            onClick={() => {
              setOpen(false);
              navigate('/cart');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Cart ({getCartCount()})</span>
          </button>

          {role && role !== 'guest' && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;