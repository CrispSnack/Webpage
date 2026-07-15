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

  const title = category === 'tea' ? 'Tea Blends' : category === 'snacks' ? 'Savoury Snacks' : 'Our Full Pantry';
  const desc = category === 'tea' 
    ? 'Handpicked leaves from the finest estates.' 
    : category === 'snacks' 
    ? 'Traditional recipes made with cold-pressed oils.' 
    : 'Everything we have to offer, made with love.';

  return (
    <div className="min-h-screen pt-16 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto bg-card p-12 rounded-[2.5rem] border border-border shadow-sm">
          <h1 className="text-4xl md:text-5xl font-heading italic mb-4 text-foreground">{title}</h1>
          <p className="text-foreground/70 text-lg mb-8">{desc}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="/__preview/b/collections" 
              className={`px-6 py-2.5 rounded-full text-[15px] font-bold transition-all ${!category ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-border'}`}
            >
              All Items
            </a>
            <a 
              href="/__preview/b/collections?category=tea" 
              className={`px-6 py-2.5 rounded-full text-[15px] font-bold transition-all ${category === 'tea' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-border'}`}
            >
              Tea
            </a>
            <a 
              href="/__preview/b/collections?category=snacks" 
              className={`px-6 py-2.5 rounded-full text-[15px] font-bold transition-all ${category === 'snacks' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-border'}`}
            >
              Snacks
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
