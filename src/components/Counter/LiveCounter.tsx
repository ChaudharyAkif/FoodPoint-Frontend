import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const StatsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  const orders = useMotionValue(0);
  const rating = useMotionValue(0);
  const delivery = useMotionValue(0);
  const partners = useMotionValue(0);

  // ✅ Transform values (THIS FIXES THE ERROR)
  const ordersText = useTransform(orders, (v) =>
    `${Math.floor(v).toLocaleString()}+`
  );
  const ratingText = useTransform(rating, (v) => `${v.toFixed(1)}/5`);
  const deliveryText = useTransform(delivery, (v) => `${Math.floor(v)}%`);
  const partnersText = useTransform(partners, (v) => `${Math.floor(v)}+`);

  useEffect(() => {
    if (isInView) {
      animate(orders, 10000, { duration: 2, ease: "easeOut" });
      animate(rating, 4.8, { duration: 2, ease: "easeOut" });
      animate(delivery, 99, { duration: 2, ease: "easeOut" });
      animate(partners, 50, { duration: 2, ease: "easeOut" });
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 md:mt-20 bg-linear-to-r from-red-500/10 to-orange-500/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 backdrop-blur-sm border border-red-200/50"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {/* Orders */}
        <div className="text-center">
          <motion.div className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-1 md:mb-2">
            {ordersText}
          </motion.div>
          <div className="text-gray-700 text-xs md:text-sm lg:text-base font-medium">
            Orders Delivered
          </div>
        </div>

        {/* Rating */}
        <div className="text-center">
          <motion.div className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-1 md:mb-2">
            {ratingText}
          </motion.div>
          <div className="text-gray-700 text-xs md:text-sm lg:text-base font-medium">
            Customer Rating
          </div>
        </div>

        {/* Delivery */}
        <div className="text-center">
          <motion.div className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-1 md:mb-2">
            {deliveryText}
          </motion.div>
          <div className="text-gray-700 text-xs md:text-sm lg:text-base font-medium">
            On-Time Delivery
          </div>
        </div>

        {/* Partners */}
        <div className="text-center">
          <motion.div className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-1 md:mb-2">
            {partnersText}
          </motion.div>
          <div className="text-gray-700 text-xs md:text-sm lg:text-base font-medium">
            Partner Restaurants
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsSection;
