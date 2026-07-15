import { useCart } from '../../../contexts/CartContext';
import { X, Minus, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tighter">CART</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <X className="w-6 h-6 stroke-[2]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="font-heading text-8xl opacity-10">0</div>
                  <p className="font-heading text-2xl font-bold uppercase">EMPTY CART</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
                  >
                    GO SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-28 h-36 bg-card border border-border flex-shrink-0 relative overflow-hidden">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover filter grayscale-[0.2]" />
                        )}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-heading text-xl font-bold uppercase leading-none">{item.product.name}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-foreground/40 hover:text-secondary transition-colors"
                            >
                              <X className="w-5 h-5 stroke-[2]" />
                            </button>
                          </div>
                          <p className="text-sm text-primary font-bold uppercase tracking-wider mt-2">{item.variant}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center bg-card border border-border">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                            >
                              <Minus className="w-4 h-4 stroke-[2]" />
                            </button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                            >
                              <Plus className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                          <p className="font-bold text-lg">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-card border-t border-border">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="block text-sm font-bold uppercase tracking-widest text-foreground/50 mb-1">TOTAL</span>
                    <p className="text-xs text-foreground/40 uppercase">TAXES & SHIPPING AT CHECKOUT</p>
                  </div>
                  <span className="font-heading text-4xl font-bold text-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <Link 
                  href="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center bg-primary text-primary-foreground py-5 font-bold uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-colors"
                >
                  CHECKOUT NOW
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
