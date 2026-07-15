import { Link } from 'wouter';
import { motion } from 'framer-motion';
import hillbayLogo from '@assets/Hillbay_Logo_1784118682916.png';

export default function PickerPage() {
  return (
    <div className="min-h-screen selection:bg-green-100" style={{ background: 'linear-gradient(160deg, #EEF7E8 0%, #E8F5F9 50%, #F5FAF4 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 lg:px-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.img
              src={hillbayLogo}
              alt="Hillbay"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
          </div>

          <div
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: '#5BBD35', color: '#3A7A2E', background: 'rgba(91,189,53,0.08)' }}
          >
            Choose Your Design Direction
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1A3A1A' }}
          >
            Hillbay
          </h1>
          <p className="text-base sm:text-lg font-medium" style={{ color: '#3A7A2E' }}>
            Refreshing your moment — premium teas & traditional snacks.
          </p>
          <p className="text-sm mt-2" style={{ color: '#587A4E' }}>
            Three distinct design directions for the same brand.
          </p>
        </motion.div>

        {/* Design cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {/* Design A — Minimal Premium */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Link href="/__preview/a" className="group block rounded-2xl overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5" style={{ background: '#FFFFFF', borderColor: '#C8E0C0' }}>
              <div className="aspect-[4/3] p-8 flex flex-col justify-center items-center" style={{ background: '#F5FAF4' }}>
                <div className="flex gap-3 mb-5">
                  <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: '#1A3A1A' }}></div>
                  <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: '#3A7A2E' }}></div>
                  <div className="w-7 h-7 rounded-full shadow-inner border" style={{ background: '#29ABD4', borderColor: '#B8D9D0' }}></div>
                  <div className="w-7 h-7 rounded-full shadow-inner border" style={{ background: '#F5D000', borderColor: '#E8C800' }}></div>
                </div>
                <h2
                  className="text-2xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1A3A1A', fontWeight: 600 }}
                >
                  Minimal Premium
                </h2>
                <p className="text-xs text-center max-w-[180px]" style={{ color: '#587A4E' }}>
                  Forest greens & ocean teal. Elegant, editorial, refined.
                </p>
              </div>
              <div className="px-6 py-4 flex justify-between items-center transition-colors" style={{ background: '#FFFFFF' }}>
                <span className="font-medium text-sm" style={{ color: '#1A3A1A' }}>View Concept A</span>
                <span className="group-hover:translate-x-1 transition-transform text-lg" style={{ color: '#3A7A2E' }}>→</span>
              </div>
            </Link>
          </motion.div>

          {/* Design B — Warm Artisanal */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link href="/__preview/b" className="group block rounded-2xl overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5" style={{ background: '#F2FAEe', borderColor: '#B8D9A8' }}>
              <div className="aspect-[4/3] p-8 flex flex-col justify-center items-center" style={{ background: '#EEF7E8' }}>
                <div className="flex gap-3 mb-5">
                  <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: '#1A3A1A' }}></div>
                  <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: '#5BBD35' }}></div>
                  <div className="w-7 h-7 rounded-full shadow-inner" style={{ background: '#1A4D6B' }}></div>
                  <div className="w-7 h-7 rounded-full shadow-inner border" style={{ background: '#F5D000', borderColor: '#C8C080' }}></div>
                </div>
                <h2
                  className="text-2xl mb-2 italic"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#1A3A1A', fontWeight: 600 }}
                >
                  Warm Artisanal
                </h2>
                <p className="text-xs text-center max-w-[180px]" style={{ color: '#587A4E' }}>
                  Leaf greens & deep navy. Earthy, handcrafted, soulful.
                </p>
              </div>
              <div className="px-6 py-4 flex justify-between items-center transition-colors" style={{ background: '#F2FAEe' }}>
                <span className="font-medium text-sm" style={{ color: '#1A3A1A' }}>View Concept B</span>
                <span className="group-hover:translate-x-1 transition-transform text-lg" style={{ color: '#5BBD35' }}>→</span>
              </div>
            </Link>
          </motion.div>

          {/* Design C — Bold Modern */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <Link href="/__preview/c" className="group block rounded-2xl overflow-hidden border shadow-sm hover:shadow-2xl hover:shadow-green-500/15 transition-all duration-300 hover:-translate-y-1.5" style={{ background: '#0B1A0B', borderColor: '#1F3B1F' }}>
              <div className="aspect-[4/3] p-8 flex flex-col justify-center items-center" style={{ background: '#0F2410' }}>
                <div className="flex gap-3 mb-5">
                  <div className="w-7 h-7 border" style={{ background: '#0B1A0B', borderColor: '#2A4A2A' }}></div>
                  <div className="w-7 h-7" style={{ background: '#5BBD35' }}></div>
                  <div className="w-7 h-7" style={{ background: '#29ABD4' }}></div>
                  <div className="w-7 h-7" style={{ background: '#F5D000' }}></div>
                </div>
                <h2
                  className="text-2xl font-bold mb-2 uppercase tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#EDF7ED' }}
                >
                  Bold Modern
                </h2>
                <p className="text-xs text-center max-w-[180px]" style={{ color: '#7AAA6A' }}>
                  Dark forest night. Green energy, kinetic and bold.
                </p>
              </div>
              <div className="px-6 py-4 flex justify-between items-center" style={{ background: '#121F12' }}>
                <span className="font-medium text-sm font-mono tracking-wider uppercase" style={{ color: '#EDF7ED' }}>View Concept C</span>
                <span className="group-hover:translate-x-1 transition-transform text-lg" style={{ color: '#5BBD35' }}>→</span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-12"
          style={{ color: '#587A4E' }}
        >
          Each concept includes: Home · Collections · Product Detail · Cart · Checkout · Account
        </motion.p>
      </div>
    </div>
  );
}
