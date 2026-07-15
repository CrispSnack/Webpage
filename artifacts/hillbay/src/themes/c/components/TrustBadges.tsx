import { Truck, Leaf, Package, MapPin } from 'lucide-react';

const GREEN = 'hsl(122 42% 51%)';
const GOLD = 'hsl(43 72% 56%)';
const BORDER = 'hsl(218 52% 20%)';
const CARD = 'hsl(218 58% 12%)';
const BG = 'hsl(218 62% 7%)';

const badges = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499', color: GREEN },
  { icon: Leaf, title: '100% Natural', desc: 'Zero artificial ingredients', color: 'hsl(122 42% 60%)' },
  { icon: Package, title: 'Packed Fresh', desc: 'Packed on order date', color: GOLD },
  { icon: MapPin, title: 'Pan-India', desc: 'We ship everywhere', color: 'hsl(210 60% 70%)' },
];

export default function TrustBadges() {
  return (
    <section className="border-t border-b" style={{ borderColor: BORDER }}>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center py-12 px-6 border-r last:border-r-0 transition-colors group cursor-default"
            style={{
              borderColor: BORDER,
              background: BG,
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = CARD)}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = BG)}
          >
            <badge.icon
              className="w-8 h-8 mb-4 stroke-[2] transition-transform group-hover:scale-110"
              style={{ color: badge.color }}
            />
            <h4
              className="text-base font-black uppercase tracking-tight mb-1"
              style={{ fontFamily: 'var(--font-heading)', color: 'hsl(210 60% 96%)' }}
            >
              {badge.title}
            </h4>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(213 28% 55%)' }}>
              {badge.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
