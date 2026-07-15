import { motion } from 'framer-motion';
import crispyLogo from '@assets/ChatGPT_Image_Jul_15,_2026,_10_24_44_PM_1784134623199.png';

const GREEN = 'hsl(122 42% 51%)';
const GOLD = 'hsl(43 72% 56%)';
const BORDER = 'hsl(218 52% 20%)';
const CARD = 'hsl(218 58% 12%)';
const MUTED_FG = 'hsl(213 28% 60%)';

export default function About() {
  return (
    <div className="bg-background text-foreground">

      {/* Hero */}
      <section
        className="relative py-24 px-4 text-center border-b overflow-hidden"
        style={{ borderColor: BORDER }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, hsl(122 42% 51% / 0.08) 0%, transparent 60%)' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <img
            src={crispyLogo}
            alt="Crispy N Snacky"
            className="w-24 h-24 mx-auto mb-6 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 30px hsl(122 42% 51% / 0.4))' }}
          />
          <p className="text-xs font-black uppercase tracking-[0.25em] mb-4" style={{ color: GREEN }}>— Our Story</p>
          <h1
            className="font-black uppercase tracking-tighter leading-[0.9] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Born Crispy.<br />
            <span style={{ color: GREEN }}>Staying</span> Snacky.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: MUTED_FG }}>
            We built Crispy N Snacky on a single belief — that the best snacks and teas come from
            people who care deeply about what they make. <em style={{ color: GREEN }}>Crunchy Moments, Delivered.</em>
          </p>
        </motion.div>
      </section>

      {/* Origin story */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>— Where We Come From</p>
          <h2
            className="text-4xl font-black uppercase tracking-tighter mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Rooted in Tamil Nadu
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: MUTED_FG }}>
            We source our teas directly from small-estate growers across Ooty, Munnar, and the Nilgiris
            — families who have tended these hills for generations. No middlemen, no compromise.
          </p>
          <p className="leading-relaxed" style={{ color: MUTED_FG }}>
            Our snacks are crafted in artisan kitchens across Tamil Nadu and Kerala using age-old recipes,
            real ingredients, and zero artificial flavours or preservatives. The crunch is real.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative h-72 border flex items-center justify-center overflow-hidden"
          style={{ background: CARD, borderColor: BORDER }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, hsl(43 72% 46% / 0.1) 0%, transparent 70%)' }}
          />
          <div className="text-center relative z-10">
            <div className="text-6xl mb-3">🌿</div>
            <p className="text-sm font-black uppercase tracking-widest" style={{ color: MUTED_FG }}>
              Nilgiri Hills, Tamil Nadu
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-b py-20 px-4 sm:px-6 lg:px-8" style={{ borderColor: BORDER }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>— What We Stand For</p>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Commitments
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: '🌾', title: 'Single-Origin', desc: 'Every product is traceable to the exact farm or kitchen it came from. Full transparency, always.', color: GREEN },
              { icon: '🤝', title: 'Fair Trade', desc: 'We pay growers and artisans above market rates. Their craft is our business.', color: GOLD },
              { icon: '♻️', title: 'Plastic-Free', desc: 'All our packaging is biodegradable or compostable. Zero plastic. That\'s a promise.', color: 'hsl(210 60% 70%)' },
            ].map((v) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 border group hover:border-primary transition-colors"
                style={{ background: CARD, borderColor: BORDER }}
              >
                <div className="text-4xl mb-5">{v.icon}</div>
                <h3
                  className="text-xl font-black uppercase tracking-tight mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: v.color }}
                >
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED_FG }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { stat: '10K+', label: 'Happy Customers', color: GREEN },
              { stat: '30+', label: 'Products & Growing', color: GOLD },
              { stat: '4.9★', label: 'Average Rating', color: GREEN },
              { stat: '2024', label: 'Est. Tamil Nadu', color: 'hsl(210 60% 70%)' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-8 border text-center"
                style={{ background: CARD, borderColor: BORDER }}
              >
                <p className="text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)', color: item.color }}>
                  {item.stat}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: MUTED_FG }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="border-t py-20 text-center px-4" style={{ borderColor: BORDER }}>
        <p
          className="text-2xl md:text-4xl font-black uppercase tracking-tighter max-w-2xl mx-auto leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          "Real ingredients. Real flavour.{' '}
          <span style={{ color: GREEN }}>Real crunch.</span>"
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: MUTED_FG }}>
          — Crispy N Snacky, Est. 2024
        </p>
      </section>
    </div>
  );
}
