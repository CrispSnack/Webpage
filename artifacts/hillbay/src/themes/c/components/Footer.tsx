import { Link } from 'wouter';
import crispyWordmark from '@assets/Header_Text_Image_transparent.png';

const GREEN = 'hsl(122 42% 51%)';
const GOLD = 'hsl(43 72% 56%)';
const BORDER = 'hsl(218 52% 20%)';
const MUTED_FG = 'hsl(213 28% 55%)';
const CARD = 'hsl(218 58% 10%)';

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: BORDER, background: CARD }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex mb-5 w-fit group hover:opacity-85 transition-opacity">
              <img
                src={crispyWordmark}
                alt="Crispy N Snacky — Crunchy Moments, Delivered"
                className="h-[68px] w-auto object-contain"
              />
            </Link>
            <p className="text-sm mb-6 max-w-xs leading-relaxed" style={{ color: MUTED_FG }}>
              Bold South Indian snacks and premium teas. Traditionally crafted. No artificial flavours. Ever.
            </p>
            <div className="flex gap-3">
              {['IG', 'FB', 'YT'].map((social) => (
                <div
                  key={social}
                  className="w-10 h-10 flex items-center justify-center text-xs font-black border cursor-pointer transition-all hover:border-primary hover:text-primary"
                  style={{ borderColor: BORDER, color: MUTED_FG }}
                >
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-xs font-black uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)', color: GREEN }}>Shop</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/__preview/c/collections' },
                { label: 'Tea', href: '/__preview/c/collections?category=tea' },
                { label: 'Snacks', href: '/__preview/c/collections?category=snacks' },
                { label: 'Gift Sets', href: '/__preview/c/collections?badge=Gift+Pick' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-bold uppercase transition-colors"
                    style={{ color: MUTED_FG }}
                    onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
                    onMouseLeave={e => (e.currentTarget.style.color = MUTED_FG)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)', color: GREEN }}>Info</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/__preview/c/about' },
                { label: 'Contact', href: '/__preview/c/contact' },
                { label: 'Account', href: '/__preview/c/account' },
                { label: 'Shipping', href: '#' },
                { label: 'FAQ', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-bold uppercase transition-colors"
                    style={{ color: MUTED_FG }}
                    onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
                    onMouseLeave={e => (e.currentTarget.style.color = MUTED_FG)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-widest mb-5" style={{ fontFamily: 'var(--font-heading)', color: GREEN }}>Contact</h4>
            <ul className="space-y-3 text-sm font-bold uppercase" style={{ color: MUTED_FG }}>
              <li>connect@hillbay.in</li>
              <li>+91 99523 40709</li>
              <li>Ponmar, Chennai — 600127</li>
              <li>Mon–Sat · 9AM–6PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: BORDER }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: MUTED_FG }}>
            © {new Date().getFullYear()} Crispy N Snacky — All Rights Reserved
          </p>
          <div className="flex items-center gap-2 px-3 py-1 border" style={{ borderColor: GOLD, color: GOLD }}>
            <span className="text-xs font-black uppercase tracking-widest">Made in Tamil Nadu 🇮🇳</span>
          </div>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest transition-colors" style={{ color: MUTED_FG }}
            onMouseEnter={e => (e.currentTarget.style.color = 'hsl(210 60% 96%)')}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED_FG)}
          >
            ← Exit Preview
          </Link>
        </div>
      </div>
    </footer>
  );
}
