import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 pr-8">
            <Link href="/__preview/b" className="text-3xl font-heading italic text-foreground mb-6 block">
              Hillbay
            </Link>
            <p className="text-[15px] text-foreground/80 max-w-sm mb-8 leading-relaxed">
              Premium Indian tea and traditional snacks, crafted with care. 
              Taste the heritage, feel the warmth. Handcrafted for your daily rituals.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Ig</div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Fb</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-xl mb-6 text-foreground">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/__preview/b/collections" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">Our Pantry</Link></li>
              <li><Link href="/__preview/b/collections?category=tea" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">Tea Blends</Link></li>
              <li><Link href="/__preview/b/collections?category=snacks" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">Savoury Snacks</Link></li>
              <li><Link href="/__preview/b/collections?badge=Gift+Pick" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">Gift Hampers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-xl mb-6 text-foreground">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/__preview/b/account" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">My Account</Link></li>
              <li><a href="#" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">Contact the Farm</a></li>
              <li><a href="#" className="text-[15px] text-foreground/80 hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-foreground/60">
            &copy; {new Date().getFullYear()} Hillbay. All rights reserved.
          </p>
          <p className="text-[15px] text-primary italic font-heading">
            Made with love in Tamil Nadu
          </p>
          <div className="flex space-x-4">
            <Link href="/" className="text-[13px] text-foreground/50 hover:text-foreground transition-colors">Exit Preview</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
