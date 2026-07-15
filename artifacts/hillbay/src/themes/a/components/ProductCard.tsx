import { Link } from 'wouter';
import { useCart } from '../../../contexts/CartContext';
import { Product } from '../../../data/products';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col"
    >
      <Link href={`/__preview/a/products/${product.slug}`} className="relative aspect-[4/5] mb-4 bg-muted overflow-hidden block">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading">
            {product.name}
          </div>
        )}
        
        {product.badge && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-medium uppercase tracking-wider px-2 py-1 border border-border/50">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product, product.variants[0]);
            }}
            className="w-full bg-background/95 backdrop-blur text-foreground text-xs uppercase tracking-widest py-3 border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            Quick Add
          </button>
        </div>
      </Link>

      <div className="flex flex-col flex-1 text-center">
        <Link href={`/__preview/a/products/${product.slug}`}>
          <h3 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-foreground/60 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </motion.div>
  );
}
