import { useCart } from '../../../contexts/CartContext';
import { Link } from 'wouter';
import { Minus, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl md:text-9xl font-heading font-bold uppercase tracking-tighter text-muted mb-8">EMPTY</h1>
        <p className="text-xl font-bold uppercase tracking-widest mb-10">YOUR CART IS WAITING.</p>
        <Link 
          href="/__preview/c/collections"
          className="bg-primary text-primary-foreground px-12 py-5 font-bold uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-colors"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter mb-16">CART</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-8">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border pb-6 text-xs font-bold uppercase tracking-widest text-foreground/50">
            <div className="col-span-6">PRODUCT</div>
            <div className="col-span-3 text-center">QTY</div>
            <div className="col-span-3 text-right">PRICE</div>
          </div>
          
          <div className="space-y-6">
            {items.map(item => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-card border border-border p-4 md:p-0 md:border-none md:bg-transparent"
              >
                <div className="md:col-span-6 flex gap-6 w-full">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-card border border-border flex-shrink-0 relative overflow-hidden group">
                    {item.product.image && (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover filter grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center py-2">
                    <Link href={`/__preview/c/products/${item.product.slug}`} className="font-heading text-2xl font-bold uppercase leading-none hover:text-primary transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-primary font-bold uppercase tracking-widest mt-2">{item.variant}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-foreground/40 hover:text-secondary transition-colors text-xs font-bold uppercase tracking-widest mt-auto w-fit flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> REMOVE
                    </button>
                  </div>
                </div>
                
                <div className="md:col-span-3 flex justify-between md:justify-center items-center w-full mt-4 md:mt-0 border-t border-border pt-4 md:pt-0 md:border-none">
                  <span className="md:hidden text-xs font-bold uppercase tracking-widest text-foreground/50">QUANTITY</span>
                  <div className="flex items-center bg-card border border-border">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Minus className="w-4 h-4 stroke-[2]" />
                    </button>
                    <span className="w-12 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Plus className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
                
                <div className="md:col-span-3 flex justify-between md:justify-end items-center w-full">
                  <span className="md:hidden text-xs font-bold uppercase tracking-widest text-foreground/50">TOTAL</span>
                  <p className="font-heading text-2xl font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-card border border-border p-8 sticky top-28">
            <h2 className="font-heading text-3xl font-bold uppercase tracking-tighter mb-8">SUMMARY</h2>
            
            <div className="space-y-6 text-sm font-bold uppercase tracking-widest mb-8 border-b border-border pb-8">
              <div className="flex justify-between">
                <span className="text-foreground/60">SUBTOTAL</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">SHIPPING</span>
                <span className={cartTotal > 499 ? 'text-primary' : ''}>{cartTotal > 499 ? 'FREE' : '₹50'}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-10">
              <span className="text-sm font-bold uppercase tracking-widest">TOTAL</span>
              <span className="font-heading text-5xl font-bold text-primary">₹{(cartTotal + (cartTotal > 499 ? 0 : 50)).toLocaleString('en-IN')}</span>
            </div>
            
            <Link 
              href="/__preview/c/checkout"
              className="w-full block text-center bg-primary text-primary-foreground py-6 text-lg font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
