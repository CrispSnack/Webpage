import { motion } from 'framer-motion';

export default function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background py-1.5 overflow-hidden flex items-center text-[10px] tracking-[0.2em] uppercase font-medium">
      <motion.div
        animate={{ x: [0, -500] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
        className="whitespace-nowrap flex space-x-8 min-w-max"
      >
        <span>Free Shipping on orders above ₹499</span>
        <span>•</span>
        <span>Pan-India Delivery</span>
        <span>•</span>
        <span>Freshly Packed</span>
        <span>•</span>
        <span>Free Shipping on orders above ₹499</span>
        <span>•</span>
        <span>Pan-India Delivery</span>
        <span>•</span>
        <span>Freshly Packed</span>
        <span>•</span>
        <span>Free Shipping on orders above ₹499</span>
        <span>•</span>
        <span>Pan-India Delivery</span>
        <span>•</span>
        <span>Freshly Packed</span>
      </motion.div>
    </div>
  );
}
