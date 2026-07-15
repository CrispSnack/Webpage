import { REVIEWS } from '../../../data/products';

export default function ReviewsBlock() {
  return (
    <section className="py-32 bg-background border-t border-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter text-foreground">
              THE<br />HYPE
            </h2>
          </div>
          <div className="flex items-center gap-4 border border-border p-4 bg-card">
            <span className="font-heading text-4xl font-bold text-primary">4.9</span>
            <div className="h-12 w-px bg-border mx-2"></div>
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-widest text-sm">OUT OF 5 STARS</span>
              <span className="text-foreground/50 text-xs font-bold uppercase">1,200+ REVIEWS</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="bg-card p-8 md:p-10 border border-border group hover:border-primary transition-colors">
              <div className="flex gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-2 ${i < review.rating ? 'bg-primary' : 'bg-muted'}`} 
                  />
                ))}
              </div>
              <p className="text-foreground font-medium text-lg uppercase mb-12 tracking-wide leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center font-heading font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-sm">{review.author}</p>
                  <p className="text-xs text-foreground/50 font-bold uppercase mt-1">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
