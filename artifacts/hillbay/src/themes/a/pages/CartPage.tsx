import { useCart } from '../../../contexts/CartContext';
import { Link } from 'wouter';
import { Minus, Plus, X } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-heading mb-6">Your Cart is Empty</h1>
        <p className="text-foreground/60 mb-8">Discover our premium blends and traditional snacks.</p>
        <Link 
          href="/__preview/a/collections"
          className="bg-foreground text-background px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-heading mb-12">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="hidden md:grid grid-cols-6 gap-4 border-b border-border pb-4 text-xs uppercase tracking-widest text-foreground/50">
            <div className="col-span-3">Product</div>
            <div className="col-span-1 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b border-border">
              <div className="col-span-3 flex gap-6">
                <div className="w-24 h-32 bg-muted flex-shrink-0">
                  {item.product.image && (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/__preview/a/products/${item.product.slug}`} className="font-heading text-xl hover:text-primary transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-foreground/60 mt-1 uppercase tracking-wider">{item.variant}</p>
                  <p className="text-sm mt-2 md:hidden">₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <div className="col-span-1 flex justify-start md:justify-center">
                <div className="flex items-center border border-border">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="col-span-2 flex justify-between md:justify-end items-center mt-4 md:mt-0">
                <p className="font-medium hidden md:block">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-foreground/40 hover:text-destructive transition-colors ml-4 uppercase text-xs tracking-widest border-b border-transparent hover:border-destructive pb-0.5"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-muted/30 p-8 border border-border">
            <h2 className="font-heading text-2xl mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-8 border-b border-border pb-6">
              <div className="flex justify-between">
                <span className="text-foreground/70">Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Shipping</span>
                <span>{cartTotal > 499 ? 'Free' : '₹50'}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl mb-8">
              <span className="font-heading">Total</span>
              <span>₹{(cartTotal + (cartTotal > 499 ? 0 : 50)).toLocaleString('en-IN')}</span>
            </div>
            <Link 
              href="/__preview/a/checkout"
              className="w-full block text-center bg-foreground text-background py-4 text-sm tracking-widest uppercase hover:bg-primary transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
