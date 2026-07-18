import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ReviewsBlock from '../components/ReviewsBlock';
import TrustBadges from '../components/TrustBadges';
import crispyLogo from '@assets/Final_Crispy_N_Snacky_Logo_1784136094962.png';

const GREEN = 'hsl(122 42% 51%)';
const GOLD = 'hsl(43 72% 56%)';
const NAVY = 'hsl(218 62% 7%)';
const CARD = 'hsl(218 58% 12%)';
const BORDER = 'hsl(218 52% 20%)';
const MUTED_FG = 'hsl(213 28% 60%)';

export default function Home() {
  const { data: allProducts = [] } = useProducts();
  const teas = allProducts.filter((p) => p.category === 'tea').slice(0, 4);
  const snacks = allProducts.filter((p) => p.category === 'snacks').slice(0, 4);
  const bestsellers = allProducts.slice(0, 4);

  return (
    <div className="flex flex-col bg-background">

      {/* ──────────────── HERO ──────────────── */}
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden border-b" style={{ borderColor: BORDER }}>
        {/* Massive BG text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
          <span
            className="text-[22vw] font-black uppercase tracking-tighter leading-none opacity-[0.04] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-heading)', color: GREEN }}
          >
            CRISPY
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 border" style={{ borderColor: GREEN, color: GREEN }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GREEN }} />
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-heading)' }}>
                  New Drops Available
                </span>
              </div>

              <h1
                className="font-black uppercase leading-[0.88] tracking-tighter mb-6"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
              >
                CRUNCHY<br />
                <span style={{ color: GREEN }}>MOMENTS,</span><br />
                <span
                  style={{
                    WebkitTextStroke: '2px ' + GREEN,
                    color: 'transparent',
                  }}
                >
                  DELIVERED.
                </span>
              </h1>

              <p className="text-lg font-medium mb-10 max-w-xl leading-relaxed" style={{ color: MUTED_FG }}>
                Bold South Indian snacks &amp; premium teas — freshly packed, traditionally crafted, 
                shipped pan-India. No artificial flavours. Ever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/collections?category=snacks"
                  className="inline-flex justify-center items-center px-8 py-4 font-black text-sm uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: GREEN, color: 'hsl(0 0% 5%)' }}
                >
                  Shop Snacks
                </Link>
                <Link
                  href="/collections?category=tea"
                  className="inline-flex justify-center items-center px-8 py-4 font-black text-sm uppercase tracking-[0.15em] transition-all border hover:border-primary hover:text-primary"
                  style={{ borderColor: BORDER, color: 'hsl(210 60% 96%)' }}
                >
                  Explore Tea
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t" style={{ borderColor: BORDER }}>
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: GREEN }}>4.9★</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: MUTED_FG }}>1,200+ Reviews</p>
                </div>
                <div className="w-px h-10" style={{ background: BORDER }} />
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: GOLD }}>10K+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: MUTED_FG }}>Happy Customers</p>
                </div>
                <div className="w-px h-10" style={{ background: BORDER }} />
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: 'hsl(210 60% 96%)' }}>30+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: MUTED_FG }}>SKUs & Growing</p>
                </div>
              </div>
            </motion.div>

            {/* Right: logo + product image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:flex flex-col items-center gap-6"
            >
              <img
                src={crispyLogo}
                alt="Crispy N Snacky"
                className="w-72 h-72 object-contain rounded-full ring-4 ring-[hsl(43_72%_56%/0.6)] drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 40px hsl(122 42% 51% / 0.3))' }}
              />
              <div className="flex gap-3 flex-wrap justify-center">
                {['Zero Artificial Flavours', 'Freshly Packed', 'Pan-India Shipping'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border"
                    style={{ borderColor: BORDER, color: MUTED_FG }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────── SCROLLING MARQUEE ──────────────── */}
      <div
        className="py-4 overflow-hidden flex items-center border-b"
        style={{ background: CARD, borderColor: BORDER }}
      >
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 14 }}
          className="flex items-center gap-0 whitespace-nowrap min-w-max"
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center">
              {['ZERO ARTIFICIAL FLAVOURS', 'DIRECT FROM SOURCE', 'TRADITIONAL RECIPES', 'FRESHLY PACKED', 'PAN-INDIA DELIVERY', 'CRUNCHY MOMENTS DELIVERED'].map((text, j) => (
                <span key={j} className="flex items-center">
                  <span
                    className="px-6 text-sm font-black uppercase tracking-[0.15em]"
                    style={{ fontFamily: 'var(--font-heading)', color: j % 2 === 0 ? GREEN : GOLD }}
                  >
                    {text}
                  </span>
                  <span style={{ color: MUTED_FG }} className="text-lg">✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ──────────────── SHOP BY CATEGORY (freestylesnacking-style) ──────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: GREEN }}>— Explore</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                Shop by<br />Category
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tea tile */}
            <Link href="/collections?category=tea" className="group relative overflow-hidden border h-64 md:h-80 flex items-end p-8" style={{ borderColor: BORDER, background: CARD }}>
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, hsl(123 54% 23%), transparent)` }}
              />
              <div className="absolute top-6 right-6 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">🍃</div>
              <div className="relative z-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] mb-2 block" style={{ color: GREEN }}>Premium Teas</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  Tea Blends
                </h3>
                <p className="text-sm mb-4" style={{ color: MUTED_FG }}>Single-origin · Nilgiri · Darjeeling · Kashmiri</p>
                <span
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-5 py-2.5 group-hover:gap-4 transition-all"
                  style={{ background: GREEN, color: 'hsl(0 0% 5%)' }}
                >
                  Shop Tea <span>→</span>
                </span>
              </div>
            </Link>

            {/* Snacks tile */}
            <Link href="/collections?category=snacks" className="group relative overflow-hidden border h-64 md:h-80 flex items-end p-8" style={{ borderColor: BORDER, background: CARD }}>
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, hsl(43 72% 30%), transparent)` }}
              />
              <div className="absolute top-6 right-6 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">🍘</div>
              <div className="relative z-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] mb-2 block" style={{ color: GOLD }}>Traditional Snacks</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  Snack Range
                </h3>
                <p className="text-sm mb-4" style={{ color: MUTED_FG }}>Murukku · Banana Chips · Thattai · Ribbon Pakoda</p>
                <span
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-5 py-2.5 group-hover:gap-4 transition-all"
                  style={{ background: GOLD, color: 'hsl(0 0% 5%)' }}
                >
                  Shop Snacks <span>→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────── BESTSELLERS ──────────────── */}
      <section className="py-20 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: GREEN }}>— Most Loved</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                Best<br />Sellers
              </h2>
            </div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest border px-5 py-3 hover:border-primary hover:text-primary transition-colors group"
              style={{ borderColor: BORDER }}
            >
              View All Products
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestsellers.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* ──────────────── SNACKS SPOTLIGHT ──────────────── */}
      <section className="py-20 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>— Traditional Snacks</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                Crispy<br />Favourites
              </h2>
            </div>
            <Link
              href="/collections?category=snacks"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest px-5 py-3 transition-all hover:opacity-90"
              style={{ background: GOLD, color: 'hsl(0 0% 5%)' }}
            >
              All Snacks →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {snacks.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── WHY US STRIP (freestylesnacking-style bold grid) ──────────────── */}
      <section className="border-t border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Source to Shelf',
                desc: 'We work directly with small-estate growers in Tamil Nadu and Kerala — zero middlemen, maximum freshness.',
                color: GREEN,
              },
              {
                icon: '🚫',
                title: 'Nothing Artificial',
                desc: 'No artificial flavours, no preservatives, no shortcuts. Just real ingredients and time-honoured recipes.',
                color: GOLD,
              },
              {
                icon: '📦',
                title: 'Packed on Demand',
                desc: 'Every order is packed fresh at our facility on the day it ships. You always get the freshest batch.',
                color: 'hsl(210 60% 70%)',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 border group hover:border-primary transition-colors"
                style={{ background: CARD, borderColor: BORDER }}
              >
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3
                  className="text-xl font-black uppercase tracking-tight mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: item.color }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED_FG }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── TEA SPOTLIGHT ──────────────── */}
      <section className="py-20 border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: GREEN }}>— Premium Teas</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                Estate<br />Blends
              </h2>
            </div>
            <Link
              href="/collections?category=tea"
              className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest px-5 py-3 transition-all hover:opacity-90"
              style={{ background: GREEN, color: 'hsl(0 0% 5%)' }}
            >
              All Teas →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teas.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsBlock />

      {/* ──────────────── NEWSLETTER (freestylesnacking-style join section) ──────────────── */}
      <section className="border-t" style={{ borderColor: BORDER }}>
        <div
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div
            className="relative overflow-hidden p-10 md:p-16 text-center border"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, hsl(122 42% 51% / 0.08) 0%, transparent 70%)' }}
            />
            <div className="relative z-10 max-w-xl mx-auto">
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>
                — Join the Snack Squad
              </p>
              <h2
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Get 10% Off<br />Your First Order
              </h2>
              <p className="mb-8 text-sm" style={{ color: MUTED_FG }}>
                Drop your email and we'll send you a code — plus early access to new drops and limited editions.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 text-sm outline-none border focus:border-primary transition-colors bg-transparent"
                  style={{ borderColor: BORDER, color: 'hsl(210 60% 96%)' }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{ background: GREEN, color: 'hsl(0 0% 5%)' }}
                >
                  Claim Discount
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
