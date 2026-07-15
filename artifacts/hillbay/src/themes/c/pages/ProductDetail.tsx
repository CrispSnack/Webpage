import { PRODUCTS } from '../../../data/products';
import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import TrustBadges from '../components/TrustBadges';
import { motion } from 'framer-motion';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find(p => p.slug === params.slug);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="py-40 text-center">
        <h1 className="font-heading text-6xl font-bold uppercase tracking-tighter">NOT FOUND</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  return (
    <div className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center text-xs font-bold tracking-widest uppercase text-foreground/50">
          <Link href="/__preview/c" className="hover:text-primary transition-colors">HOME</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-border" />
          <Link href={`/__preview/c/collections?category=${product.category}`} className="hover:text-primary transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-border" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] bg-card border border-border relative group"
          >
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover filter grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
              />
            )}
            {product.badge && (
              <span className="absolute top-6 left-6 bg-secondary text-secondary-foreground px-4 py-2 text-sm font-bold tracking-widest uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-6 leading-[0.9]">
              {product.name}
            </h1>
            <p className="text-4xl font-bold text-primary mb-8 font-heading">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            
            <div className="text-lg text-foreground/80 mb-12 font-medium uppercase tracking-wide leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="space-y-10 mb-12">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-4">
                  SELECT OPTION
                </label>
                <div className="flex flex-wrap gap-4">
                  {product.variants.map(variant => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all ${
                        selectedVariant === variant 
                          ? 'bg-foreground text-background border border-foreground' 
                          : 'bg-card text-foreground border border-border hover:border-primary hover:text-primary'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-4">
                  QUANTITY
                </label>
                <div className="flex items-center bg-card border border-border w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-16 h-16 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <Minus className="w-5 h-5 stroke-[2]" />
                  </button>
                  <span className="w-16 text-center text-lg font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-16 h-16 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <Plus className="w-5 h-5 stroke-[2]" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground py-6 px-8 text-xl font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-[8px_8px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 border border-transparent hover:border-white"
            >
              ADD TO CART — ₹{(product.price * quantity).toLocaleString('en-IN')}
            </button>

            <div className="mt-12 pt-8 border-t border-border">
              <ul className="text-sm font-bold uppercase tracking-widest text-foreground/60 space-y-4">
                <li className="flex items-center gap-4">
                  <span className="text-primary text-lg">■</span>
                  SHIPS IN 24 HOURS
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-secondary text-lg">■</span>
                  SECURE CHECKOUT
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      
      <TrustBadges />
    </div>
  );
}
