import hillbayLogo from '@assets/Hillbay_Logo_1784118682916.png';

export default function About() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'hsl(100 33% 90%)' }}>
        <img src={hillbayLogo} alt="Hillbay" className="w-24 h-24 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-5xl md:text-6xl font-heading italic font-semibold mb-4 text-foreground">
          Our Story
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-foreground/70 leading-relaxed">
          Born in the misty hills of the Nilgiris, Hillbay was founded with a single belief —
          every sip and every bite should <em>refresh your moment</em>.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Who We Are</span>
          <h2 className="text-3xl font-heading italic font-semibold mb-5 text-foreground">Rooted in Tamil Nadu</h2>
          <p className="text-foreground/70 leading-relaxed mb-4">
            We source our teas directly from small-estate growers across Ooty, Munnar, and Kodaikanal —
            people who have tended these slopes for generations. No middlemen. No compromise.
          </p>
          <p className="text-foreground/70 leading-relaxed">
            Our snacks are crafted by artisan kitchens in Tamil Nadu using age-old recipes, 
            real ingredients, and zero artificial flavours or preservatives.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-card-border h-72 flex items-center justify-center" style={{ background: 'hsl(95 40% 90%)' }}>
          <div className="text-center px-8 opacity-60">
            <div className="text-6xl mb-3">🌿</div>
            <p className="text-sm font-medium text-foreground/50 italic">Hill Estate, Nilgiris</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border py-16 px-4" style={{ background: 'hsl(100 40% 97%)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading italic font-semibold text-center mb-12 text-foreground">What We Stand For</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '🍃', title: 'Single-Origin', desc: 'Every product is traceable back to the farm it came from.' },
              { icon: '🤝', title: 'Fair Trade', desc: 'We pay growers above market rates to sustain their craft and livelihoods.' },
              { icon: '📦', title: 'Plastic-Free', desc: 'All packaging is biodegradable or compostable. Zero plastic, always.' },
            ].map((v) => (
              <div key={v.title} className="bg-card rounded-2xl p-7 border border-card-border text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-heading italic text-xl font-semibold mb-2 text-foreground">{v.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-16 text-center px-4">
        <p className="text-2xl md:text-3xl font-heading italic text-foreground/70 max-w-xl mx-auto leading-snug">
          "Every hill has a story. Every cup carries it home."
        </p>
        <p className="mt-4 text-sm text-foreground/40 tracking-widest uppercase">— Hillbay, Est. 2024</p>
      </section>
    </div>
  );
}
