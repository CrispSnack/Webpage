import { PRODUCTS } from '../../../data/products';
import { useCart } from '../../../contexts/CartContext';
import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import TrustBadges from '../components/TrustBadges';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find(p => p.slug === params.slug);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="py-24 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center text-xs tracking-widest uppercase text-foreground/50">
          <Link href="/__preview/a" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href={`/__preview/a/collections?category=${product.category}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image */}
          <div className="aspect-[4/5] bg-muted relative">
            {product.image && (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-background px-3 py-1.5 text-xs tracking-widest uppercase border border-border">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-heading mb-4">{product.name}</h1>
            <p className="text-xl mb-8">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="prose prose-sm md:prose-base text-foreground/70 mb-10 font-light">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-3">
                  Size / Weight
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(variant => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-5 py-2.5 text-sm border transition-all ${
                        selectedVariant === variant 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border text-foreground hover:border-foreground/50'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-3">
                  Quantity
                </label>
                <div className="flex items-center border border-border w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-foreground text-background py-4 px-8 text-sm font-medium tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Add to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}
            </button>

            <div className="mt-8 pt-8 border-t border-border">
              <ul className="text-sm text-foreground/60 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Ships within 24 hours
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  100% secure checkout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <TrustBadges />
    </div>
  );
}
