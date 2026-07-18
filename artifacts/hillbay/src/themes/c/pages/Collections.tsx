import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function Collections() {
  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get('category') ?? undefined;

  const { data: products = [], isLoading, isError } = useProducts({ category });

  const title = category === 'tea' ? 'TEA' : category === 'snacks' ? 'SNACKS' : 'ALL DROPS';

  return (
    <div className="min-h-screen pb-32">
      <div className="bg-card border-b border-border py-20 mb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-heading font-bold uppercase tracking-tighter mb-12"
          >
            {title}
          </motion.h1>

          <div className="flex flex-wrap gap-4">
            <a
              href="/collections"
              className={`px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all border ${!category ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground border-border hover:border-primary hover:text-primary'}`}
            >
              EVERYTHING
            </a>
            <a
              href="/collections?category=tea"
              className={`px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all border ${category === 'tea' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground border-border hover:border-primary hover:text-primary'}`}
            >
              TEA BLENDS
            </a>
            <a
              href="/collections?category=snacks"
              className={`px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all border ${category === 'snacks' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground border-border hover:border-primary hover:text-primary'}`}
            >
              SNACKS
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-card border border-border animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-muted-foreground py-20 font-bold uppercase tracking-widest">
            Failed to load products. Please try again.
          </p>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <p className="text-center text-muted-foreground py-20 font-bold uppercase tracking-widest">
            No products found.
          </p>
        )}

        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
