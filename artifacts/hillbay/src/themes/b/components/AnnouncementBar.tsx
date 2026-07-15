import { motion } from 'framer-motion';

export default function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden flex items-center text-xs tracking-wider font-medium">
      <motion.div
        animate={{ x: [0, -500] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        className="whitespace-nowrap flex space-x-12 min-w-max"
      >
        <span>Free Shipping on orders above ₹499</span>
        <span className="opacity-50">~</span>
        <span>100% Natural Ingredients</span>
        <span className="opacity-50">~</span>
        <span>Freshly Packed in Kerala & Tamil Nadu</span>
        <span className="opacity-50">~</span>
        <span>Free Shipping on orders above ₹499</span>
        <span className="opacity-50">~</span>
        <span>100% Natural Ingredients</span>
        <span className="opacity-50">~</span>
        <span>Freshly Packed in Kerala & Tamil Nadu</span>
      </motion.div>
    </div>
  );
}
