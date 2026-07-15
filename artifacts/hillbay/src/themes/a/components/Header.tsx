import { Link } from 'wouter';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import hillbayLogo from '@assets/Hillbay_Logo_1784118682916.png';

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left nav */}
          <nav className="hidden md:flex space-x-8 flex-1">
            <Link href="/__preview/a/collections" className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
              SHOP ALL
            </Link>
            <Link href="/__preview/a/collections?category=tea" className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
              TEA
            </Link>
            <Link href="/__preview/a/collections?category=snacks" className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>
              SNACKS
            </Link>
          </nav>

          {/* Logo — centered */}
          <div className="flex-1 flex justify-center">
            <Link href="/__preview/a" className="flex items-center gap-3 hover:opacity-85 transition-opacity group">
              <img
                src={hillbayLogo}
                alt="Hillbay"
                className="h-12 w-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="text-xl tracking-widest text-foreground hidden sm:block"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
              >
                Hillbay
              </span>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex-1 flex items-center justify-end space-x-5">
            <button className="text-foreground/70 hover:text-primary transition-colors" aria-label="Search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link href="/__preview/a/account" className="text-foreground/70 hover:text-primary transition-colors" aria-label="Account">
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>
            <button
              className="text-foreground/70 hover:text-primary transition-colors relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
