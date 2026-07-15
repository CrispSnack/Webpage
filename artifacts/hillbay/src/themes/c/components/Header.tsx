import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import crispyWordmark from '@assets/Header_Text_Image_transparent.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Products',
    href: '/collections',
    children: [
      { label: '🍃 Tea', href: '/collections?category=tea', desc: 'Premium loose-leaf & blends' },
      { label: '🍘 Snacks', href: '/collections?category=snacks', desc: 'Traditional South Indian favourites' },
      { label: '✦ All Products', href: '/collections', desc: 'Browse the full range' },
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

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        className="sticky top-0 z-40 border-b transition-all duration-300"
        style={{
          background: 'hsl(218 62% 9% / 0.97)',
          backdropFilter: 'blur(16px)',
          borderColor: 'hsl(218 52% 20%)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo (left) ── */}
            <Link href="/" className="flex items-center shrink-0 group hover:opacity-90 transition-opacity">
              <img
                src={crispyWordmark}
                alt="Crispy N Snacky — Crunchy Moments, Delivered"
                className="h-[68px] w-auto object-contain"
              />
            </Link>

            {/* ── Desktop Nav (right) ── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProductsOpen((o) => !o)}
                      aria-expanded={productsOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                        isActive(link.href)
                          ? 'text-primary'
                          : 'text-foreground/70 hover:text-foreground'
                      }`}
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {productsOpen && (
                      <div
                        className="absolute top-full right-0 mt-2 w-60 border shadow-2xl overflow-hidden z-50"
                        style={{
                          background: 'hsl(218 58% 11%)',
                          borderColor: 'hsl(218 52% 22%)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px hsl(122 42% 51% / 0.15)',
                        }}
                      >
                        {link.children.map((child, i) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setProductsOpen(false)}
                            className="flex flex-col gap-0.5 px-5 py-3.5 transition-colors group/item border-b"
                            style={{
                              borderColor: i < link.children.length - 1 ? 'hsl(218 52% 18%)' : 'transparent',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(218 52% 16%)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span
                              className="text-sm font-bold uppercase tracking-wide text-foreground/90 group-hover/item:text-primary transition-colors"
                              style={{ fontFamily: 'var(--font-heading)' }}
                            >
                              {child.label}
                            </span>
                            <span className="text-xs text-foreground/40">{child.desc}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                      isActive(link.href) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                    }`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* Divider */}
              <div className="w-px h-5 mx-2" style={{ background: 'hsl(218 52% 22%)' }} />

              {/* Icons */}
              <Link
                href="/account"
                className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 stroke-[2]" />
              </Link>
              <button
                className="relative p-2 text-foreground/60 hover:text-foreground transition-colors"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-black"
                    style={{ background: 'hsl(122 42% 51%)', color: 'hsl(0 0% 5%)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Shop CTA */}
              <Link
                href="/collections"
                className="ml-3 px-5 py-2 text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                style={{
                  background: 'hsl(122 42% 51%)',
                  color: 'hsl(0 0% 5%)',
                }}
              >
                Shop Now
              </Link>
            </nav>

            {/* ── Mobile: cart + burger ── */}
            <div className="flex md:hidden items-center gap-2">
              <button
                className="relative p-2 text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-black"
                    style={{ background: 'hsl(122 42% 51%)', color: 'hsl(0 0% 5%)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
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
            style={{ borderColor: 'hsl(218 52% 20%)', background: 'hsl(218 62% 9%)' }}
          >
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileProductsOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wide text-foreground/70 hover:text-foreground transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileProductsOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2" style={{ borderColor: 'hsl(122 42% 51%)' }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase text-foreground/60 hover:text-primary transition-colors"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    isActive(link.href) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="border-t pt-3 mt-2" style={{ borderColor: 'hsl(218 52% 20%)' }}>
              <Link
                href="/collections"
                className="flex items-center justify-center w-full py-3 text-xs font-black uppercase tracking-widest"
                style={{ background: 'hsl(122 42% 51%)', color: 'hsl(0 0% 5%)' }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
