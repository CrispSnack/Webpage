import { Truck, Leaf, Package, MapPin } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹499" },
    { icon: Leaf, title: "100% Natural", desc: "No artificial flavours" },
    { icon: Package, title: "Freshly Packed", desc: "Straight from the source" },
    { icon: MapPin, title: "Pan-India", desc: "Delivered everywhere" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-4 bg-background">
                <badge.icon className="w-5 h-5 text-primary stroke-[1.5]" />
              </div>
              <h4 className="font-heading text-lg mb-1">{badge.title}</h4>
              <p className="text-xs text-foreground/60">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
