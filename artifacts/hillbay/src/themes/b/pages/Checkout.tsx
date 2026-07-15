import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { CheckCircle2, Leaf } from 'lucide-react';

export default function Checkout() {
  const { cartTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const total = cartTotal + (cartTotal > 499 ? 0 : 50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    clearCart();
  };

  if (step === 2) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 bg-background">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
          <Leaf className="w-12 h-12 text-secondary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading italic mb-4 text-center">Order Confirmed!</h1>
        <p className="text-foreground/70 mb-8 text-center max-w-md font-medium text-lg">
          Your treats will be freshly packed and dispatched soon.
        </p>
        <Link 
          href="/__preview/b"
          className="bg-card border-2 border-border px-8 py-3 rounded-xl font-bold hover:bg-muted transition-colors shadow-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 bg-background">
      <h1 className="text-4xl md:text-5xl font-heading italic mb-10 text-center">Checkout</h1>
      
      <div className="bg-card p-6 md:p-10 rounded-[2.5rem] border border-border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-heading italic text-primary border-b border-border/50 pb-4">1. Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-bold text-foreground/70 mb-2 pl-2">First Name</label>
                <input required type="text" className="w-full bg-background border-2 border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-colors font-medium shadow-sm" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-foreground/70 mb-2 pl-2">Last Name</label>
                <input required type="text" className="w-full bg-background border-2 border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-colors font-medium shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[14px] font-bold text-foreground/70 mb-2 pl-2">Email Address</label>
                <input required type="email" className="w-full bg-background border-2 border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-colors font-medium shadow-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-heading italic text-primary border-b border-border/50 pb-4">2. Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[14px] font-bold text-foreground/70 mb-2 pl-2">Full Address</label>
                <input required type="text" className="w-full bg-background border-2 border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-colors font-medium shadow-sm" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-foreground/70 mb-2 pl-2">City</label>
                <input required type="text" className="w-full bg-background border-2 border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-colors font-medium shadow-sm" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-foreground/70 mb-2 pl-2">PIN Code</label>
                <input required type="text" className="w-full bg-background border-2 border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-colors font-medium shadow-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-heading italic text-primary border-b border-border/50 pb-4">3. Payment (Demo)</h2>
            <div className="p-6 md:p-8 rounded-2xl bg-muted border-2 border-border shadow-inner">
              <p className="text-[15px] font-medium text-foreground/70 mb-6">This is a UI demo. No payment will be processed.</p>
              <div className="flex justify-between items-end bg-card p-6 rounded-xl border border-border shadow-sm">
                <span className="font-heading text-xl italic">Total Amount to Pay</span>
                <span className="text-2xl font-bold text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-primary-foreground py-5 rounded-xl text-lg font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5">
            Complete Order
          </button>
        </form>
      </div>
    </div>
  );
}
