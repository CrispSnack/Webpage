import { REVIEWS } from '../../../data/products';
import { Star } from 'lucide-react';

export default function ReviewsBlock() {
  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading mb-4 text-foreground">Loved by Our Community</h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm text-foreground/60">Based on 1,200+ reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="bg-background p-8 border border-border flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`} 
                  />
                ))}
              </div>
              <p className="text-foreground/80 italic font-serif flex-1 mb-6 text-lg leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <p className="font-medium text-sm tracking-wide">{review.author}</p>
                <p className="text-xs text-foreground/50 uppercase tracking-widest mt-1">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
