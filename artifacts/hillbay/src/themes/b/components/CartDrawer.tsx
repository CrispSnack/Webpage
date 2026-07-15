import { useCart } from '../../../contexts/CartContext';
import { X, Minus, Plus, ShoppingBasket } from 'lucide-react';
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
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#FBF5EC] border-l border-[#D9C9B0] shadow-2xl z-50 flex flex-col rounded-l-3xl overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <ShoppingBasket className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-2xl italic text-foreground">Your Basket</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 -mr-2 bg-muted rounded-full text-foreground/60 hover:text-foreground hover:bg-border transition-colors"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-foreground/60 space-y-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingBasket className="w-8 h-8 text-foreground/40" />
                  </div>
                  <p className="font-heading text-2xl text-foreground">Your basket is empty</p>
                  <p className="text-[15px] max-w-[250px]">Looks like you haven't added any treats yet.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-5 bg-card p-4 rounded-2xl border border-border shadow-sm">
                      <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-heading text-lg leading-tight text-foreground">{item.product.name}</h3>
                            <p className="text-[13px] text-foreground/60 mt-1 font-medium">{item.variant}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-foreground/40 hover:text-destructive transition-colors bg-muted rounded-full p-1.5"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center bg-muted rounded-full p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-background shadow-sm text-foreground hover:text-primary"
                            >
                              <Minus className="w-3 h-3 stroke-[2]" />
                            </button>
                            <span className="w-8 text-center text-[13px] font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-background shadow-sm text-foreground hover:text-primary"
                            >
                              <Plus className="w-3 h-3 stroke-[2]" />
                            </button>
                          </div>
                          <p className="font-bold text-[15px]">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between text-xl mb-6">
                  <span className="font-heading font-medium">Subtotal</span>
                  <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[13px] text-foreground/60 text-center mb-5 bg-muted py-2 rounded-lg">
                  Shipping & taxes calculated at checkout
                </p>
                <Link 
                  href="/__preview/b/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center bg-primary text-primary-foreground py-4 rounded-xl text-[15px] font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
