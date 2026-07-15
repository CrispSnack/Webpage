import { useLocation } from 'wouter';
import { PRODUCTS } from '../../../data/products';
import ProductCard from '../components/ProductCard';
import { useMemo } from 'react';

export default function Collections() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get('category');
  
  const filteredProducts = useMemo(() => {
    if (category === 'tea') return PRODUCTS.filter(p => p.category === 'tea');
    if (category === 'snacks') return PRODUCTS.filter(p => p.category === 'snacks');
    return PRODUCTS;
  }, [category]);

  const title = category === 'tea' ? 'Premium Teas' : category === 'snacks' ? 'Traditional Snacks' : 'All Collection';

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading mb-6">{title}</h1>
          <div className="flex items-center justify-center gap-6 text-sm tracking-widest uppercase">
            <a 
              href="/__preview/a/collections" 
              className={`pb-1 border-b transition-colors ${!category ? 'border-foreground' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
            >
              All
            </a>
            <a 
              href="/__preview/a/collections?category=tea" 
              className={`pb-1 border-b transition-colors ${category === 'tea' ? 'border-foreground' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
            >
              Tea
            </a>
            <a 
              href="/__preview/a/collections?category=snacks" 
              className={`pb-1 border-b transition-colors ${category === 'snacks' ? 'border-foreground' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
            >
              Snacks
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
