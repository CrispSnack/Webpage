import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../../../data/products';
import ProductCard from '../components/ProductCard';
import ReviewsBlock from '../components/ReviewsBlock';
import TrustBadges from '../components/TrustBadges';

export default function Home() {
  const bestsellers = PRODUCTS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-[#FAFAF7]">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <h1 className="text-[20vw] font-heading whitespace-nowrap">HILLBAY</h1>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-6">
              Est. 2024
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-foreground mb-8 leading-tight">
              A Ritual of<br />Taste & Time
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto font-sans font-light">
              Discover our curated collection of premium loose-leaf teas 
              and heritage South Indian snacks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/__preview/a/collections?category=tea"
                className="w-full sm:w-auto px-8 py-4 bg-foreground text-background text-sm font-medium tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Shop Tea
              </Link>
              <Link 
                href="/__preview/a/collections?category=snacks"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border text-foreground text-sm font-medium tracking-widest uppercase hover:border-foreground transition-all duration-300"
              >
                Shop Snacks
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <TrustBadges />

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading mb-4">Curated Selections</h2>
              <p className="text-foreground/60">Our most beloved blends and bites.</p>
            </div>
            <Link 
              href="/__preview/a/collections"
              className="hidden md:inline-block text-sm uppercase tracking-widest border-b border-foreground/30 hover:border-foreground pb-1 transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link 
              href="/__preview/a/collections"
              className="inline-block px-8 py-4 border border-border text-sm uppercase tracking-widest"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-24 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading mb-6 leading-tight">
            "The perfect cup of tea demands patience. The perfect snack demands tradition."
          </h2>
          <p className="text-lg opacity-80 font-serif italic mb-10">— The Hillbay Philosophy</p>
          <Link 
            href="/__preview/a/about"
            className="inline-block text-sm uppercase tracking-widest border-b border-current pb-1 hover:opacity-70 transition-opacity"
          >
            Read Our Story
          </Link>
        </div>
      </section>

      <ReviewsBlock />
    </div>
  );
}
