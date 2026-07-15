import { REVIEWS } from '../../../data/products';
import { Star } from 'lucide-react';

export default function ReviewsBlock() {
  return (
    <section className="py-24 bg-[#EDE0CF]/30 border-y border-[#D9C9B0]/50 relative overflow-hidden">
      {/* Decorative texture overlay could go here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading italic mb-4 text-foreground">Letters from our family</h2>
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-[15px] text-foreground/70 font-medium">Joined by 1,200+ happy homes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-sm flex flex-col relative">
              <div className="absolute -top-4 -right-4 text-6xl text-primary/10 font-heading leading-none">"</div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'fill-secondary text-secondary' : 'text-muted'}`} 
                  />
                ))}
              </div>
              <p className="text-foreground/80 font-heading text-xl italic flex-1 mb-8 leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-heading font-bold text-lg">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[15px]">{review.author}</p>
                  <p className="text-[13px] text-foreground/60">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
