import { motion } from 'framer-motion';

const items = [
  'FREE SHIPPING OVER ₹499',
  'PAN-INDIA DELIVERY',
  '100% NATURAL INGREDIENTS',
  'FRESHLY PACKED ON ORDER',
  'TRADITIONAL RECIPES',
  'ZERO ARTIFICIAL FLAVOURS',
];

export default function AnnouncementBar() {
  return (
    <div
      className="py-2.5 overflow-hidden flex items-center text-xs tracking-[0.18em] font-bold uppercase border-b"
      style={{
        background: 'hsl(122 42% 51%)',
        color: 'hsl(0 0% 5%)',
        borderColor: 'hsl(123 54% 38%)',
      }}
    >
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 18 }}
        className="whitespace-nowrap flex items-center gap-0 min-w-max"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex items-center">
            {items.map((item, j) => (
              <span key={j} className="flex items-center gap-0">
                <span className="px-6">{item}</span>
                <span className="opacity-50 text-base">✦</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
