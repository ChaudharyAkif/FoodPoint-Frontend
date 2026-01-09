import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Clock,
  Shield,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Flame,
  Leaf,
  ChefHat,
  Search,
  ArrowUpDown,
  Heart,
  Zap,
  Award,
  Quote,
  ThumbsUp,
  Users,
  CheckCircle,
  Gift,
  TrendingUp,
  X,
  Sparkles,
  Eye,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { TypeAnimation } from 'react-type-animation';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuthContext';
import HeroBanner from './CardDesign';

import Logo from '../assets/fpt-logo.png';
import StatsSection from '../components/Counter/LiveCounter';

// Define strict interfaces to prevent TypeErrors
interface BaseItem {
  _id: string;
  price: number;
  image?: string;
  description?: string;
  type: 'product' | 'deal';
  name: string; // Unified name property
  category?: string;
  dietaryInfo?: {
    isVegan?: boolean;
    isVegetarian?: boolean;
    isSpicy?: boolean;
  };
}

const getDealImageId = (index: number) => {
  const imageIds = [
    '1565299624946-b28f40a0ae38', // Pizza
    '1568901346375-23c9450c58cd', // Burger
    '1555939594-58d7cb561ad1', // Food platter
    '1565958011703-44f9829ba187', // Pasta
    '1546069901-ba9599a7e63c', // Sushi
    '1567620905732-2d1ec7ab7445', // Pancakes
    '1565299585323-38d6b0865b47', // BBQ
    '1604908176997-125f25cc6f3d', // Steak
  ];
  return imageIds[index % imageIds.length];
};

const HomePage = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // --- FILTER STATES ---
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  // Mobile menu state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { addToCart, getCartCount } = useCart();
  const { role } = useAuth();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsRes, productsRes] = await Promise.all([
        axiosInstance.get('/deals'),
        axiosInstance.get('/products'),
      ]);

      // ✅ Safe filtering - agar data nahi hai to empty array
      const dealsData = Array.isArray(dealsRes?.data)
        ? dealsRes.data.filter((deal: any) => deal.status === 'active')
        : [];

      const productsData = Array.isArray(productsRes?.data) ? productsRes.data : [];

      setDeals(dealsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // ✅ Error pe bhi empty arrays set karenge
      setDeals([]);
      setProducts([]);
    } finally {
      // ✅ Loading false ho jayegi chahe kuch bhi ho
      setLoading(false);
    }
  };
  // --- NORMALIZE DATA ---
  const allItems: BaseItem[] = [
    ...deals.map((d) => ({
      ...d,
      type: 'deal' as const,
      name: d.dealName,
      category: 'Deals',
      dietaryInfo: { isVegan: false, isVegetarian: false, isSpicy: false },
    })),
    ...products.map((p) => ({
      ...p,
      type: 'product' as const,
      name: p.productName,
    })),
  ];

  // Enhanced features with gradients
  const features = [
    {
      icon: <Clock className="w-8 h-8 md:w-10 md:h-10" />,
      title: '30-Minute Delivery',
      description: 'Get your food hot and fresh within 30 minutes or 50% off',
      gradient: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    },
    {
      icon: <Shield className="w-8 h-8 md:w-10 md:h-10" />,
      title: '100% Safe & Secure',
      description: 'Contactless delivery and secure payment options',
      gradient: 'from-emerald-500 to-green-400',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
    },
    {
      icon: <Star className="w-8 h-8 md:w-10 md:h-10" />,
      title: 'Premium Quality',
      description: 'All ingredients are fresh and sourced from trusted suppliers',
      gradient: 'from-amber-500 to-yellow-400',
      bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    },
    {
      icon: <Truck className="w-8 h-8 md:w-10 md:h-10" />,
      title: 'Free Delivery',
      description: 'Free delivery on orders above $25',
      gradient: 'from-purple-500 to-pink-400',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    },
  ];

  // Enhanced testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Food Blogger',
      content:
        'Best food delivery experience ever! The deals are amazing and food always arrives hot.',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b786d4f9?w=150&auto=format&fit=crop',
      date: '2 days ago',
      verified: true,
    },
    {
      name: 'Michael Chen',
      role: 'Regular Customer',
      content: 'As a busy professional, FoodPoint saves me time. The deals make it affordable too!',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
      date: '1 week ago',
      verified: true,
    },
    {
      name: 'Emma Rodriguez',
      role: 'Food Critic',
      content: 'The quality is restaurant-level at home delivery prices. Highly recommended!',
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      date: '3 days ago',
      verified: true,
    },
    {
      name: 'Alex Thompson',
      role: 'Fitness Enthusiast',
      content: 'Healthy options are fantastic! Perfect for my diet plan and tastes amazing.',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      date: '1 month ago',
      verified: true,
    },
  ];

  // Added 'Deals' to categoriess
  const categories = ['all', 'Deals', 'Italian', 'Starters', 'Signature', 'Desi'];

  // --- HANDLERS ---
  const handleAddToCart = (item: BaseItem) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      type: item.type,
      ...(item.type === 'deal' ? { dealId: item._id } : { productId: item._id }),
      image:
        item.image ||
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
    });
  };

  const nextSlide = () => setCurrentDealIndex((prev) => (prev + 1) % deals.length);
  const prevSlide = () => setCurrentDealIndex((prev) => (prev - 1 + deals.length) % deals.length);

  useEffect(() => {
    if (deals.length > 0 && isAutoScrolling) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [deals.length, isAutoScrolling]);

  // --- FILTERING LOGIC ---
  const filteredItems = allItems
    .filter((item) => {
      // 1. Search Query (Check Name AND Description)
      const matchesSearch =
        (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      // 2. Category Filter
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'Deals') {
          matchesCategory = item.type === 'deal';
        } else {
          matchesCategory =
            item.category?.toLowerCase().includes(selectedCategory.toLowerCase()) || false;
        }
      }

      // 3. Dietary Filter
      let matchesDietary = true;
      if (dietaryFilter === 'vegan') matchesDietary = !!item.dietaryInfo?.isVegan;
      if (dietaryFilter === 'vegetarian') matchesDietary = !!item.dietaryInfo?.isVegetarian;
      if (dietaryFilter === 'spicy') matchesDietary = !!item.dietaryInfo?.isSpicy;

      return matchesCategory && matchesSearch && matchesDietary;
    })
    .sort((a, b) => {
      // 4. Sorting
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Stats for hero section
  const heroStats = [
    { value: '10K+', label: 'Happy Customers', icon: <Users className="w-4 h-4 md:w-5 md:h-5" /> },
    { value: '4.8★', label: 'Avg Rating', icon: <Star className="w-4 h-4 md:w-5 md:h-5" /> },
    { value: '30min', label: 'Avg Delivery', icon: <Clock className="w-4 h-4 md:w-5 md:h-5" /> },
    { value: '100+', label: 'Menu Items', icon: <Award className="w-4 h-4 md:w-5 md:h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50/30 via-white to-orange-50/30">
      {/* Floating Cart Button - Mobile and Desktop */}

      {role !== 'superadmin' && role !== 'cashier' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => navigate('/cart')}
            className="relative bg-linear-to-r from-red-500 to-orange-500 text-white p-3 md:p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />

            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-red-500">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dietary Filters */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-700">Dietary Preferences</h4>
                  {['vegetarian', 'vegan', 'spicy'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setDietaryFilter(dietaryFilter === type ? 'all' : type)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all w-full ${
                        dietaryFilter === type
                          ? 'bg-linear-to-r from-red-50 to-orange-50 border-red-500 text-red-600'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {type === 'vegan' ? (
                        <Leaf className="w-5 h-5" />
                      ) : type === 'spicy' ? (
                        <Flame className="w-5 h-5" />
                      ) : (
                        <ChefHat className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-red-500 outline-none text-base font-semibold text-gray-800"
                  >
                    <option value="default">Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                {/* Categories for Mobile */}
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-700 mb-4">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsMobileFiltersOpen(false);
                        }}
                        className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-linear-to-r from-red-500 to-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? 'All' : category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroBanner />

      {/* Enhanced Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-linear-to-br from-red-600 via-orange-500 to-amber-400"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [100, 0, 100],
              y: [50, 0, 50],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-1/4 right-1/4 w-56 h-56 md:w-80 md:h-80 bg-amber-300/10 rounded-full blur-3xl"
          />
        </div>
      </motion.section>

      {/* Enhanced Deal Slider Section - Responsive */}
      {/* Enhanced Deal Slider Section - Responsive */}
      {deals.length > 0 && (
        <section className="py-12 md:py-24 bg-linear-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Zap className="w-6 h-6 md:w-10 md:h-10 text-orange-500" />
                <span className="text-xs md:text-sm font-bold text-orange-600 uppercase tracking-widest">
                  Limited Time Offers
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                <TypeAnimation
                  sequence={[
                    'Mega Deals', // Text to type
                    2000, // Wait 2s
                    '', // Optional: delete text
                    1000, // Wait 1s
                  ]}
                  speed={50} // Typing speed (ms)
                  className="bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent"
                  wrapper="span"
                  repeat={Infinity} // Loop the animation
                />{' '}
                of the Week
              </h2>
            </motion.div>

            <div className="relative min-h-[80vh] sm:min-h-[94vh] md:h-125 lg:h-150  ">
              <div className="overflow-x-hidden  shadow-xl md:shadow-2xl shadow-red-500/20 h-full">
                <div className="relative  h-[80vh] sm:h-[95vh] md:h-125 lg:h-150">
                  <AnimatePresence mode="wait">
                    {deals.map(
                      (deal, index) =>
                        index === currentDealIndex && (
                          <motion.div
                            key={deal._id}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                            className="absolute inset-0"
                          >
                            <div className="relative h-full">
                              <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-transparent md:via-black/60 md:to-transparent z-10" />
                              <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{
                                  backgroundImage: `url('${deal.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop'}')`,
                                  backgroundPosition: 'center 30%',
                                }}
                              />
                              <div className="relative z-20 h-full flex items-center">
                                <div className="container mx-auto px-4 md:px-8">
                                  <div className="max-w-xl md:max-w-2xl">
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.2 }}
                                      className="mb-4 md:mb-6 inline-block bg-linear-to-r from-red-500 to-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold shadow-lg"
                                    >
                                      <span className="flex items-center gap-1 md:gap-2">
                                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                                        MOST POPULAR DEAL
                                      </span>
                                    </motion.div>

                                    <motion.h2
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.3 }}
                                      className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight"
                                    >
                                      {deal.dealName}
                                    </motion.h2>

                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.4 }}
                                      className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-6 md:mb-8"
                                    >
                                      <div className="flex flex-col">
                                        <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
                                          €{deal.price}
                                        </span>
                                        <span className="text-white/70 line-through text-xl md:text-3xl">
                                          €{(deal.price * 1.5).toFixed(2)}
                                        </span>
                                      </div>
                                      <div className="bg-white text-red-600 px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-base md:text-lg shadow-xl">
                                        Save €{(deal.price * 0.5).toFixed(2)}!
                                      </div>
                                    </motion.div>

                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 }}
                                      className="flex flex-col sm:flex-row gap-3 md:gap-4"
                                    >
                                      <button
                                        onClick={() =>
                                          handleAddToCart({
                                            ...deal,
                                            type: 'deal',
                                            name: deal.dealName,
                                          })
                                        }
                                        className="group bg-white text-red-600 hover:bg-gray-50 px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl md:shadow-2xl flex items-center justify-center gap-2 md:gap-3"
                                      >
                                        <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                        Add to Cart
                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-100 flex items-center justify-center">
                                          <span className="text-red-600 text-xs md:text-sm font-bold">
                                            +
                                          </span>
                                        </div>
                                      </button>
                                      <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300">
                                        View Details
                                      </button>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced Slider Controls - Responsive Option 2 */}
                <div className="absolute inset-x-0 bottom-4 md:bottom-8 px-4 md:px-0 z-30 flex items-center justify-between md:justify-center md:gap-6">
                  {/* Left Arrow - Positioned left on mobile, centered-gap on desktop */}
                  <button
                    onClick={prevSlide}
                    onMouseEnter={() => setIsAutoScrolling(false)}
                    onMouseLeave={() => setIsAutoScrolling(true)}
                    className="bg-black/20 md:bg-white/20 hover:bg-white/30 backdrop-blur-md w-4 h-4 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30 shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </button>

                  {/* Slide Indicators - Hidden on small screens, flex on md and up */}
                  <div className="hidden md:flex items-center gap-2 px-2">
                    {deals.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDealIndex(index)}
                        onMouseEnter={() => setIsAutoScrolling(false)}
                        onMouseLeave={() => setIsAutoScrolling(true)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === currentDealIndex
                            ? 'bg-white w-8 shadow-md'
                            : 'bg-white/40 hover:bg-white/60 w-2.5'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Right Arrow - Positioned right on mobile, centered-gap on desktop */}
                  <button
                    onClick={nextSlide}
                    onMouseEnter={() => setIsAutoScrolling(false)}
                    onMouseLeave={() => setIsAutoScrolling(true)}
                    className="bg-black/20 md:bg-white/20 hover:bg-white/30 backdrop-blur-md w-4 h-4 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30 shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </button>
                </div>

                {/* Auto-scroll indicator */}
                <div className="absolute top-3 md:top-6 right-3 md:right-6 z-30">
                  <div
                    className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-1 md:gap-2 ${
                      isAutoScrolling
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isAutoScrolling ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
                    />
                    <span className="hidden sm:inline">
                      {isAutoScrolling ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Features Section - Responsive */}

      {/* Enhanced Main Menu Grid Section - Responsive */}
      <section id="menu-section" className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Heart className="w-6 h-6 md:w-10 md:h-10 text-red-500" />
              <span className="text-xs md:text-sm font-bold text-red-600 uppercase tracking-widest">
                Our Selection
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Discover Our{' '}
              <TypeAnimation
                sequence={['Menu']} // Type "Menu" once
                speed={70} // Smooth typing speed
                wrapper="span"
                className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
                repeat={0} // Do not loop
              />
            </h2>

            <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
              Browse our full range of products & exclusive deals
            </p>
          </motion.div>

          {/* Enhanced Filters & Search - Responsive */}
          <div className="bg-white p-4 md:p-6 lg:p-8 shadow-lg md:shadow-xl mb-8 md:mb-12 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between mb-4 md:mb-6">
              {/* Enhanced Search - Responsive */}
              <div className="relative w-full lg:w-auto lg:flex-1 max-w-2xl">
                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search deals or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 md:pl-14 pr-6 py-3 md:py-4 rounded-xl md:rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 md:focus:ring-4 focus:ring-red-100 outline-none transition-all text-xs md:text-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="text-xs md:text-sm text-gray-400">
                    {filteredItems.length} items
                  </div>
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-2xl text-gray-700 font-medium"
              >
                <ArrowUpDown className="w-4 h-4" />
                Filters
              </button>

              {/* Enhanced Sort & Dietary - Desktop */}
              <div className="hidden lg:flex flex-wrap gap-3 md:gap-4 items-center">
                <div className="flex items-center gap-2 md:gap-3 bg-linear-to-r from-gray-50 to-gray-100 px-4 md:px-5 py-2 md:py-3 rounded-2xl border border-gray-200">
                  <ArrowUpDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm md:text-base font-semibold text-gray-800 cursor-pointer min-w-32 md:min-w-40"
                  >
                    <option value="default">Sort by: Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                <div className="hidden md:flex gap-2 md:gap-3">
                  {['vegetarian', 'vegan', 'spicy'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setDietaryFilter(dietaryFilter === type ? 'all' : type)}
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-2xl border-2 transition-all ${
                        dietaryFilter === type
                          ? 'bg-linear-to-r from-red-50 to-orange-50 border-red-500 text-red-600 shadow-lg'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'
                      }`}
                      title={`Filter by ${type}`}
                    >
                      {type === 'vegan' ? (
                        <Leaf className="w-4 h-4 md:w-5 md:h-5" />
                      ) : type === 'spicy' ? (
                        <Flame className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <ChefHat className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                      <span className="text-xs md:text-sm font-medium capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Categories - Responsive */}
            <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-medium transition-all transform hover:scale-105 active:scale-95 ${
                    selectedCategory === category
                      ? 'bg-linear-to-r from-red-500 to-orange-500 text-white shadow-lg md:shadow-xl shadow-red-500/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Items' : category}
                  {category === 'Deals'}
                </button>
              ))}
            </div>

            {/* Cart Count Indicator */}
            <div className="mt-4 md:mt-6 flex justify-center border-t border-gray-200">
              <div className="inline-flex items-center gap-2 mt-2 md:gap-2 px-4 py-2 md:px-6 md:py-3">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="text-primary text-sm md:text-base font-semibold">
                  {getCartCount()} item{getCartCount() !== 1 ? 's' : ''} in cart
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 md:h-96">
              <div className="relative">
                <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-10 md:h-10 text-red-500" />
              </div>
              <p className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg">
                Loading delicious items...
              </p>
            </div>
          ) : (
            <>
              {/* Items Grid - Responsive */}
              {/* Deals Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Deals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  {filteredItems
                    .filter((item) => item.type === 'deal')
                    .map((item, index) => (
                      <motion.div
                        key={`deal-${item._id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true, margin: '-50px' }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border-2 border-transparent hover:border-red-200 overflow-hidden"
                      >
                        {/* Image, tags, price, etc. same as before */}
                        <div className="relative h-48 overflow-hidden shrink-0">
                          <img
                            src={
                              item.image ||
                              `https://images.unsplash.com/photo-${getDealImageId(index)}?w=800&auto=format&fit=crop`
                            }
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-linear-to-r from-primary to-orange-400 text-white px-3 py-1.5 rounded-xl font-bold shadow-lg">
                            € {item.price}
                          </div>
                          <div className="absolute top-3 left-3 bg-linear-to-r from-yellow-500 to-amber-500 text-black px-3 py-1.5 rounded-xl font-bold shadow-lg flex items-center gap-1">
                            <Zap className="w-3 h-3" /> DEAL
                          </div>
                        </div>
                        <div className="p-4 flex flex-col grow">
                          <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {item.description || 'A money-saving delicious combo!'}
                          </p>
                          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 font-medium capitalize">
                              {item.category || item.type}
                            </div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-primary hover:bg-orange-600 text-white px-4 py-1.5 rounded-2xl transition-all duration-300"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Products Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  {filteredItems
                    .filter((item) => item.type !== 'deal')
                    .map((item, index) => (
                      <motion.div
                        key={`product-${item._id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true, margin: '-50px' }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border-2 border-transparent hover:border-red-200 overflow-hidden"
                      >
                        {/* Image, tags, price, etc. same as before */}
                        <div className="relative h-48 overflow-hidden shrink-0">
                          <img
                            src={
                              item.image ||
                              `https://images.unsplash.com/photo-${getDealImageId(index)}?w=800&auto=format&fit=crop`
                            }
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-linear-to-r from-primary to-orange-400 text-white px-3 py-1.5 rounded-xl font-bold shadow-lg">
                            € {item.price}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col grow">
                          <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {item.description || 'Freshly prepared for you.'}
                          </p>
                          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 font-medium capitalize">
                              {item.category || item.type}
                            </div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-primary hover:bg-orange-600 text-white px-4 py-1.5 rounded-2xl transition-all duration-300"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 md:py-20"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 bg-linear-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center">
                    <ChefHat className="w-10 h-10 md:w-16 md:h-16 text-red-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                    No items match your filters
                  </h3>
                  <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setDietaryFilter('all');
                    }}
                    className="bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-8 md:py-7 bg-linear-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 md:mb-8 leading-snug">
              Why Choose{' '}
              <TypeAnimation
                sequence={[
                  'FoodPoint', // Text to type
                  2000, // Wait 2s
                  '', // Optional: delete text
                  1000, // Wait 1s before typing again
                ]}
                speed={50} // Typing speed
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent"
                wrapper="span"
                repeat={Infinity} // Loop the animation
              />
            </h2>
            <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
              We're committed to delivering more than just food - we deliver experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`${feature.bgColor} rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl md:hover:shadow-2xl p-6 md:p-8 transition-all duration-300 border border-gray-100/50`}
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 md:mb-6 mx-auto shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center text-gray-900 mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Customer Reviews Section - Responsive */}
      <section className="py-8 md:py-14 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Quote className="w-6 h-6 md:w-10 md:h-10 text-red-500" />
              <span className="text-xs md:text-sm font-bold text-red-600 uppercase tracking-widest">
                Customer Love
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              What Our{' '}
              <TypeAnimation
                sequence={['Customers', 2000, 'Clients', 2000, 'Users', 2000]}
                speed={50}
                wrapper="span"
                repeat={Infinity}
                className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
              />{' '}
              Say
            </h2>

            <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their daily meals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl md:hover:shadow-2xl p-6 md:p-8 transition-all duration-300 border border-gray-100"
              >
                {/* Customer Info */}
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border-2 border-red-100"
                    />
                    {testimonial.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border-2 border-white">
                        <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-xs md:text-sm">{testimonial.role}</p>
                    <p className="text-red-500 text-xs font-medium mt-0.5 md:mt-1">
                      {testimonial.date}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 md:w-5 md:h-5 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-1 md:ml-2 text-xs md:text-sm font-semibold text-gray-700">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6 leading-relaxed italic relative">
                  <Quote className="absolute -left-1 -top-1 md:-left-2 md:-top-2 w-4 h-4 md:w-6 md:h-6 text-red-200" />
                  "{testimonial.content}"
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 pt-3 md:pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                    <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Helpful</span>
                  </button>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Gift className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                    <span className="text-red-600 font-medium">Verified Order</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Banner - Responsive */}
          <StatsSection />
        </div>
      </section>

      {/* Enhanced Footer - Responsive */}
      <footer className="text-white py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="p-1 md:p-2 rounded-xl md:rounded-2xl">
                <img className="h-10 w-10" src={Logo} alt="FTP Logo" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-black">FoodPoint</h2>
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto text-sm md:text-lg">
              Delivering happiness and delicious meals to your doorstep since 2026
            </p>
          </div>

          <div className="border-t border-gray-800 pt-8 md:pt-12 text-center text-gray-500">
            <p className="mb-3 md:mb-2 text-sm md:text-base">
              &copy; {new Date().getFullYear()} FoodPoint. All rights reserved.
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              Deliciousness delivered to your doorstep
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
