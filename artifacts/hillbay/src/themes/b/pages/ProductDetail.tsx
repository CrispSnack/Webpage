import { PRODUCTS } from '../../../data/products';
import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Minus, Plus, Heart } from 'lucide-react';
import TrustBadges from '../components/TrustBadges';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find(p => p.slug === params.slug);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="py-32 text-center font-heading text-2xl">Recipe not found</div>;
  }

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  return (
    <div className="bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center text-[13px] font-bold text-foreground/50">
          <Link href="/__preview/b" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href={`/__preview/b/collections?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-6 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden relative shadow-inner">
              {product.image && (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              )}
              {product.badge && (
                <span className="absolute top-6 left-6 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-[13px] font-bold shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-heading italic mb-4 text-foreground">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mb-6">₹{product.price.toLocaleString('en-IN')}</p>
              
              <div className="text-[16px] text-foreground/80 mb-10 leading-relaxed font-medium">
                <p>{product.description}</p>
              </div>

              <div className="space-y-8 mb-10">
                <div>
                  <label className="block text-[14px] font-bold text-foreground/70 mb-3">
                    Size / Weight
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map(variant => (
                      <button
                        key={variant}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
                          selectedVariant === variant 
                            ? 'border-2 border-primary bg-primary/10 text-primary' 
                            : 'border-2 border-border bg-background text-foreground hover:border-primary/40'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-foreground/70 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center bg-background border-2 border-border rounded-xl w-fit p-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-10 flex items-center justify-center rounded-lg hover:bg-muted text-foreground transition-colors"
                    >
                      <Minus className="w-5 h-5 stroke-[2]" />
                    </button>
                    <span className="w-12 text-center font-bold text-[15px]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-10 flex items-center justify-center rounded-lg hover:bg-muted text-foreground transition-colors"
                    >
                      <Plus className="w-5 h-5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground py-4 px-8 rounded-xl text-[16px] font-bold shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Add to Basket — ₹{(product.price * quantity).toLocaleString('en-IN')}
                </button>
                <button className="w-14 h-14 bg-background border-2 border-border rounded-xl flex items-center justify-center text-foreground/60 hover:text-secondary hover:border-secondary transition-colors shadow-sm">
                  <Heart className="w-6 h-6 stroke-[2]" />
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-border/60">
                <ul className="text-[14px] font-medium text-foreground/70 space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    Freshly packed upon order
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    Ships in traditional eco-friendly packaging
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TrustBadges />
    </div>
  );
}
