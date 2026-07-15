import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../../../data/products';
import ProductCard from '../components/ProductCard';
import ReviewsBlock from '../components/ReviewsBlock';
import TrustBadges from '../components/TrustBadges';

export default function Home() {
  const bestsellers = PRODUCTS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#F5EEE3] overflow-hidden">
        {/* Organic shapes background */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <span className="inline-block bg-muted text-foreground/80 px-4 py-1.5 rounded-full text-[13px] font-bold tracking-wide mb-6 border border-border">
              Harvested with care
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-foreground mb-6 leading-[1.1]">
              The warmth of home, <br className="hidden lg:block"/>in every bite.
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-lg font-medium leading-relaxed">
              Handcrafted South Indian snacks and boutique tea blends that bring you back to your roots.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/__preview/b/collections?category=tea"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl text-[15px] font-bold shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                Shop Tea Blends
              </Link>
              <Link 
                href="/__preview/b/collections?category=snacks"
                className="w-full sm:w-auto px-8 py-4 bg-card border-2 border-border text-foreground rounded-xl text-[15px] font-bold hover:border-primary/30 hover:bg-muted transition-all duration-300 text-center"
              >
                Shop Snacks
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="aspect-[4/5] bg-muted rounded-[3rem] overflow-hidden border-8 border-card shadow-2xl rotate-3 transform-origin-bottom hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1594631252845-29fc4cc8c011?auto=format&fit=crop&q=80&w=800" 
                alt="Pouring tea" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23EDE0CF"/><text x="50%" y="50%" font-family="serif" font-size="24" text-anchor="middle" fill="%234A7C59">Hillbay Collection</text></svg>';
                }}
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-3xl border border-border shadow-xl w-64 -rotate-6">
              <p className="font-heading italic text-xl text-foreground mb-2">"Tastes just like my paati used to make."</p>
              <div className="flex text-secondary gap-1">
                {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <TrustBadges />

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading italic mb-4">Pantry Favourites</h2>
            <p className="text-foreground/70 text-lg">Curated selections of our most beloved recipes.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/__preview/b/collections"
              className="inline-block px-10 py-4 bg-card border-2 border-border text-foreground rounded-xl font-bold shadow-sm hover:border-primary/50 hover:bg-muted transition-all duration-300"
            >
              Explore Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Story Banner Section */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODggWk04IDBMMCA4IFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-secondary-foreground/10 rounded-full text-sm font-bold tracking-wider mb-8">
            OUR STORY
          </span>
          <h2 className="text-4xl md:text-6xl font-heading italic mb-8 leading-tight">
            Rooted in the soil of the Nilgiris. Crafted for your home.
          </h2>
          <p className="text-lg md:text-xl opacity-90 font-medium mb-10 max-w-2xl mx-auto">
            We partner directly with small estate farmers and traditional snack makers to bring authentic regional flavours across India.
          </p>
          <Link 
            href="/__preview/b/about"
            className="inline-flex items-center gap-2 text-[15px] font-bold border-b-2 border-secondary-foreground pb-1 hover:opacity-80 transition-opacity"
          >
            Learn more about us
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      <ReviewsBlock />
    </div>
  );
}
