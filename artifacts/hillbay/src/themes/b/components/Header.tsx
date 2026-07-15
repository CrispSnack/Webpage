import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import hillbayLogo from '@assets/Hillbay_Logo_1784118682916.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: '/collections',
    children: [
      { label: '🍃 Tea', href: '/collections?category=tea', desc: 'Single-origin loose-leaf blends' },
      { label: '🍘 Snacks', href: '/collections?category=snacks', desc: 'Traditional South Indian favourites' },
    ],
  },
  { label: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300"
        style={{ backgroundColor: 'hsl(100 40% 97% / 0.96)', borderColor: 'hsl(var(--border))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo (left) ── */}
            <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-85 transition-opacity group">
              <img
                src={hillbayLogo}
                alt="Hillbay"
                className="h-12 w-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="text-[22px] italic hidden sm:block text-foreground"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
              >
                Hillbay
              </span>
            </Link>

            {/* ── Desktop Nav (right) ── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  /* Products dropdown */
                  <div key={link.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProductsOpen((o) => !o)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                        isActive(link.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/75 hover:text-foreground hover:bg-muted'
                      }`}
                      style={{ fontFamily: 'var(--font-body, Lato, sans-serif)' }}
                      aria-expanded={productsOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown panel */}
                    {productsOpen && (
                      <div
                        className="absolute top-full right-0 mt-2 w-56 rounded-2xl border shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        style={{
                          background: 'hsl(100 40% 97%)',
                          borderColor: 'hsl(var(--border))',
                          boxShadow: '0 12px 40px rgba(58,122,46,0.12)',
                        }}
                      >
                        <div className="p-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-muted transition-colors group/item"
                              onClick={() => setProductsOpen(false)}
                            >
                              <span
                                className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors"
                                style={{ fontFamily: 'var(--font-body, Lato, sans-serif)' }}
                              >
                                {child.label}
                              </span>
                              <span className="text-xs text-foreground/50">{child.desc}</span>
                            </Link>
                          ))}
                          <div className="border-t border-border mt-2 pt-2">
                            <Link
                              href="/collections"
                              className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-primary/10 text-primary"
                              onClick={() => setProductsOpen(false)}
                            >
                              View All Products
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground/75 hover:text-foreground hover:bg-muted'
                    }`}
                    style={{ fontFamily: 'var(--font-body, Lato, sans-serif)' }}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* Divider */}
              <div className="w-px h-5 bg-border mx-2" />

              {/* Cart & Account */}
              <Link
                href="/account"
                className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>
              <button
                className="relative p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
                    style={{
                      background: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                      borderColor: 'hsl(100 40% 97%)',
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            </nav>

            {/* ── Mobile: cart + burger ── */}
            <div className="flex md:hidden items-center gap-2">
              <button
                className="relative p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 py-4 space-y-1"
            style={{ borderColor: 'hsl(var(--border))', background: 'hsl(100 40% 97%)' }}
          >
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileProductsOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                    style={{ fontFamily: 'var(--font-body, Lato, sans-serif)' }}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileProductsOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                      <Link
                        href="/collections"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                      >
                        View All Products
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive(link.href) ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  }`}
                  style={{ fontFamily: 'var(--font-body, Lato, sans-serif)' }}
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="border-t border-border pt-3 mt-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                My Account
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
