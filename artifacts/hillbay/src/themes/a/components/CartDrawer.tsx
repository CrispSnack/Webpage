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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-heading text-2xl">Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 -mr-2 text-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/50 space-y-4">
                  <p className="font-heading text-xl">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-sm uppercase tracking-widest border-b border-foreground/30 hover:border-foreground pb-1 transition-colors text-foreground"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-muted flex-shrink-0">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-heading text-lg leading-tight">{item.product.name}</h3>
                            <p className="text-xs text-foreground/60 mt-1 uppercase tracking-wider">{item.variant}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-foreground/40 hover:text-destructive transition-colors p-1 -mr-1"
                          >
                            <X className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-border rounded-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground"
                            >
                              <Minus className="w-3 h-3 stroke-[1.5]" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground"
                            >
                              <Plus className="w-3 h-3 stroke-[1.5]" />
                            </button>
                          </div>
                          <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-background/50 backdrop-blur">
                <div className="flex justify-between text-lg mb-6">
                  <span className="font-heading">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-foreground/50 text-center mb-4">
                  Shipping & taxes calculated at checkout
                </p>
                <Link 
                  href="/__preview/a/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center bg-foreground text-background py-4 text-sm font-medium tracking-widest uppercase hover:bg-primary transition-colors"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
