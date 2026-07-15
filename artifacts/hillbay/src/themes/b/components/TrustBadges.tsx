import { Truck, Leaf, Package, MapPin } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: Truck, title: "Farm to Door", desc: "Free shipping over ₹499" },
    { icon: Leaf, title: "100% Natural", desc: "No artificial flavours" },
    { icon: Package, title: "Hand Packed", desc: "With love & care" },
    { icon: MapPin, title: "All India", desc: "Delivered to every pin code" },
  ];

  return (
    <section className="py-16 bg-card border-y border-border/50 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {badges.map((badge, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center ${idx > 1 ? 'pt-8 md:pt-0' : ''} ${idx % 2 !== 0 ? 'pl-4' : 'pr-4'} md:px-4`}>
              <div className="w-16 h-16 rounded-full bg-muted/50 border border-primary/20 flex items-center justify-center mb-5">
                <badge.icon className="w-7 h-7 text-secondary stroke-[1.5]" />
              </div>
              <h4 className="font-heading text-xl mb-2 text-foreground">{badge.title}</h4>
              <p className="text-[14px] text-foreground/70">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
