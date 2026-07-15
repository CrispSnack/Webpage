import { useCart } from '../../../contexts/CartContext';
import { Link } from 'wouter';
import { Minus, Plus, ShoppingBasket } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-background">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <ShoppingBasket className="w-10 h-10 text-primary/60" />
        </div>
        <h1 className="text-4xl font-heading italic mb-4">Your Basket is Empty</h1>
        <p className="text-foreground/70 mb-8 font-medium">Time to fill it with some delicious treats.</p>
        <Link 
          href="/__preview/b/collections"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5"
        >
          Explore the Pantry
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-background">
      <div className="flex items-center gap-4 mb-12">
        <ShoppingBasket className="w-8 h-8 text-primary" />
        <h1 className="text-4xl md:text-5xl font-heading italic text-foreground">Your Basket</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 bg-muted rounded-2xl flex-shrink-0 overflow-hidden shadow-inner w-full md:w-32">
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 w-full flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <Link href={`/__preview/b/products/${item.product.slug}`} className="font-heading text-2xl hover:text-primary transition-colors italic">
                    {item.product.name}
                  </Link>
                  <p className="text-[14px] text-foreground/60 mt-1 font-bold">{item.variant}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-destructive/80 hover:text-destructive text-[13px] font-bold mt-4 underline decoration-destructive/30 underline-offset-4"
                  >
                    Remove item
                  </button>
                </div>
                
                <div className="flex items-center justify-between md:flex-col md:justify-center md:items-end gap-4">
                  <p className="font-bold text-xl md:text-right w-full">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                  <div className="flex items-center bg-background border-2 border-border rounded-xl p-1 shadow-sm">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-foreground">
                      <Minus className="w-4 h-4 stroke-[2]" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-foreground">
                      <Plus className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm sticky top-32">
            <h2 className="font-heading text-2xl italic mb-6">Order Summary</h2>
            <div className="space-y-4 text-[15px] font-medium mb-8 bg-background p-6 rounded-2xl border border-border/50">
              <div className="flex justify-between">
                <span className="text-foreground/70">Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Shipping</span>
                <span className={cartTotal > 499 ? 'text-secondary font-bold' : ''}>
                  {cartTotal > 499 ? 'Free' : '₹50'}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-2xl mb-8 items-end">
              <span className="font-heading italic">Total</span>
              <span className="font-bold text-primary">₹{(cartTotal + (cartTotal > 499 ? 0 : 50)).toLocaleString('en-IN')}</span>
            </div>
            <Link 
              href="/__preview/b/checkout"
              className="w-full block text-center bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              Checkout Securely
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
