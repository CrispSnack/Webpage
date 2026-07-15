import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/__preview/a" className="text-2xl font-heading tracking-widest text-foreground mb-4 block">
              HILLBAY
            </Link>
            <p className="text-sm text-foreground/70 max-w-sm mb-6 leading-relaxed">
              Premium Indian tea and traditional snacks, crafted with care. 
              Quality you can taste, warmth you can feel.
            </p>
            <div className="flex space-x-4">
              {/* Social links placeholders */}
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-foreground/50">Ig</div>
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-foreground/50">Fb</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg mb-4 text-foreground">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/__preview/a/collections" className="text-sm text-foreground/70 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/__preview/a/collections?category=tea" className="text-sm text-foreground/70 hover:text-primary transition-colors">Premium Tea</Link></li>
              <li><Link href="/__preview/a/collections?category=snacks" className="text-sm text-foreground/70 hover:text-primary transition-colors">Traditional Snacks</Link></li>
              <li><Link href="/__preview/a/collections?badge=Gift+Pick" className="text-sm text-foreground/70 hover:text-primary transition-colors">Gifting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg mb-4 text-foreground">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/__preview/a/account" className="text-sm text-foreground/70 hover:text-primary transition-colors">My Account</Link></li>
              <li><a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/50">
            &copy; {new Date().getFullYear()} HILLBAY. All rights reserved.
          </p>
          <p className="text-xs text-foreground/60 italic font-serif">
            Made with love in Tamil Nadu
          </p>
          <div className="flex space-x-4">
            <Link href="/" className="text-xs text-foreground/40 hover:text-foreground">Exit Preview</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
