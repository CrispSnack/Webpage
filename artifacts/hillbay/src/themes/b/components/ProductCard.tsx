import { Link } from 'wouter';
import { useCart } from '../../../contexts/CartContext';
import { Product } from '../../../data/products';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/__preview/b/products/${product.slug}`} className="relative aspect-square bg-muted overflow-hidden block">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading">
            {product.name}
          </div>
        )}
        
        {product.badge && (
          <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-col flex-1 p-6 text-center">
        <Link href={`/__preview/b/products/${product.slug}`}>
          <h3 className="font-heading text-xl text-foreground group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-[15px] font-medium text-foreground/80 mb-6">₹{product.price.toLocaleString('en-IN')}</p>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product, product.variants[0]);
          }}
          className="mt-auto w-full bg-muted text-foreground font-medium py-3 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
        >
          Add to Basket
        </button>
      </div>
    </motion.div>
  );
}
