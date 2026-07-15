import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="py-16 px-4 text-center border-b border-border" style={{ background: 'hsl(100 33% 90%)' }}>
        <h1 className="text-5xl md:text-6xl font-heading italic font-semibold mb-4 text-foreground">
          Get in Touch
        </h1>
        <p className="text-lg text-foreground/60 max-w-xl mx-auto">
          Questions about an order? Bulk enquiries? Partnership ideas?
          We'd love to hear from you.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-heading italic font-semibold mb-8 text-foreground">Our Details</h2>
          <ul className="space-y-6">
            {[
              { icon: MapPin, label: 'Address', value: '14, Gandhi Road, Coimbatore, Tamil Nadu — 641001' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'hello@hillbay.in' },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9 AM – 6 PM IST' },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-card-border bg-card">
                  <Icon className="w-5 h-5 text-primary stroke-[1.5]" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-0.5">{label}</p>
                  <p className="text-foreground/80 text-sm leading-snug">{value}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-5 rounded-2xl border border-card-border bg-card">
            <p className="text-sm font-semibold text-foreground mb-1">Bulk & Wholesale Orders</p>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Planning to stock Hillbay in your café, hotel, or store?
              Write to us at <span className="text-primary font-medium">wholesale@hillbay.in</span> with your requirements.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-heading italic font-semibold mb-8 text-foreground">Send a Message</h2>
          {submitted ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center">
              <div className="text-4xl mb-3">🌿</div>
              <p className="font-heading italic text-xl font-semibold text-foreground mb-2">Thank you, {form.name}!</p>
              <p className="text-sm text-foreground/60">We'll get back to you at {form.email} within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { id: 'name', label: 'Your Name', type: 'text', placeholder: 'e.g. Priya Sharma' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'priya@example.com' },
                { id: 'subject', label: 'Subject', type: 'text', placeholder: 'Order query, wholesale, etc.' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1.5">{label}</label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    required
                    value={form[id as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-shadow"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1.5">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help…"
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none transition-shadow"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
