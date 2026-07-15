import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { CheckCircle2 } from 'lucide-react';

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
        <h1 className="text-4xl font-heading mb-4 text-center">Order Confirmed</h1>
        <p className="text-foreground/70 mb-8 text-center max-w-md">
          Thank you for your order. We've sent a confirmation email to you.
        </p>
        <Link 
          href="/__preview/a"
          className="border border-foreground px-8 py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-heading mb-10 text-center">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-6">
          <h2 className="text-xl font-heading border-b border-border pb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">First Name</label>
              <input required type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">Last Name</label>
              <input required type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">Email Address</label>
              <input required type="email" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-heading border-b border-border pb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">Address Line</label>
              <input required type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">City</label>
              <input required type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">PIN Code</label>
              <input required type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-heading border-b border-border pb-4">Payment (Demo)</h2>
          <div className="p-6 border border-border bg-muted/20">
            <p className="text-sm text-foreground/70 mb-4">This is a UI demo. No payment will be processed.</p>
            <div className="flex justify-between items-center text-xl">
              <span className="font-heading">Total Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-foreground text-background py-5 text-sm uppercase tracking-widest hover:bg-primary transition-colors">
          Place Order
        </button>
      </form>
    </div>
  );
}
