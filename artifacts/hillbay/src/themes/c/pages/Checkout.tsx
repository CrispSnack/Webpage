import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';

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
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="font-heading text-[120px] font-bold text-primary leading-none mb-6">DONE.</div>
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-4 text-center">ORDER CONFIRMED</h1>
        <p className="text-foreground/60 mb-12 text-center max-w-md font-bold uppercase tracking-wider text-sm">
          WE'VE RECEIVED YOUR ORDER AND IT WILL BE SHIPPED SHORTLY.
        </p>
        <Link 
          href="/"
          className="border-2 border-primary text-primary px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          BACK TO STORE
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-16 md:py-24">
      <h1 className="text-6xl md:text-8xl font-heading font-bold uppercase tracking-tighter mb-16 border-b border-border pb-8">
        CHECKOUT
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="space-y-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-4">
            <span className="w-8 h-px bg-primary"></span> 01. CONTACT INFO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">FIRST NAME</label>
              <input required type="text" className="w-full border border-border bg-card p-4 focus:outline-none focus:border-primary transition-colors text-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">LAST NAME</label>
              <input required type="text" className="w-full border border-border bg-card p-4 focus:outline-none focus:border-primary transition-colors text-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">EMAIL ADDRESS</label>
              <input required type="email" className="w-full border border-border bg-card p-4 focus:outline-none focus:border-primary transition-colors text-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-4">
            <span className="w-8 h-px bg-primary"></span> 02. SHIPPING
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">FULL ADDRESS</label>
              <input required type="text" className="w-full border border-border bg-card p-4 focus:outline-none focus:border-primary transition-colors text-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">CITY</label>
              <input required type="text" className="w-full border border-border bg-card p-4 focus:outline-none focus:border-primary transition-colors text-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/60 mb-3">PIN CODE</label>
              <input required type="text" className="w-full border border-border bg-card p-4 focus:outline-none focus:border-primary transition-colors text-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-4">
            <span className="w-8 h-px bg-primary"></span> 03. PAYMENT
          </h2>
          <div className="p-8 border border-border bg-card">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              UI DEMO - NO ACTUAL PAYMENT
            </p>
            <div className="flex justify-between items-end border-t border-border pt-6">
              <span className="font-bold uppercase tracking-widest">TOTAL</span>
              <span className="font-heading text-4xl font-bold text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-primary-foreground py-6 text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-[8px_8px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 border border-transparent hover:border-white">
          PLACE ORDER
        </button>
      </form>
    </div>
  );
}
