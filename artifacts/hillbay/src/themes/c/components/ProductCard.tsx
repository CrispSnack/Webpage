import { Link } from 'wouter';
import { useCart } from '../../../contexts/CartContext';
import type { ApiProduct } from '../../../types/product';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart();
  const image = product.images?.[0];
  const price = parseFloat(product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col relative"
    >
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] bg-card border-2 border-transparent group-hover:border-primary transition-all duration-300 overflow-hidden block">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover object-center filter grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading font-bold uppercase text-center p-4">
            {product.name}
          </div>
        )}

        {product.badge && (
          <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 pointer-events-none" />
      </Link>

      <div className="mt-6 flex justify-between items-start">
        <Link href={`/products/${product.slug}`} className="flex-1 pr-4">
          <h3 className="font-heading text-xl font-bold uppercase text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-foreground/70">₹{price.toLocaleString('en-IN')}</p>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product, product.weight ?? '');
          }}
          className="w-12 h-12 bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shrink-0"
        >
          <Plus className="w-6 h-6 stroke-[2]" />
        </button>
      </div>
    </motion.div>
  );
}
