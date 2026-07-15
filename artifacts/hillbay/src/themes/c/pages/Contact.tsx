import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const GREEN = 'hsl(122 42% 51%)';
const GOLD = 'hsl(43 72% 56%)';
const BORDER = 'hsl(218 52% 20%)';
const CARD = 'hsl(218 58% 12%)';
const MUTED_FG = 'hsl(213 28% 60%)';
const FG = 'hsl(210 60% 96%)';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputStyle = {
    background: 'hsl(218 62% 7%)',
    borderColor: BORDER,
    color: FG,
  };

  return (
    <div className="bg-background text-foreground">

      {/* Hero */}
      <section className="py-20 px-4 text-center border-b relative overflow-hidden" style={{ borderColor: BORDER }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, hsl(122 42% 51% / 0.07) 0%, transparent 60%)' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <p className="text-xs font-black uppercase tracking-[0.25em] mb-4" style={{ color: GREEN }}>— Say Hello</p>
          <h1
            className="font-black uppercase tracking-tighter leading-[0.9] mb-4"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Get in<br /><span style={{ color: GREEN }}>Touch</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: MUTED_FG }}>
            Questions about an order? Bulk enquiries? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-14">

        {/* Contact details */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ color: GREEN }}>— Our Details</p>
          <ul className="space-y-5 mb-10">
            {[
              { icon: MapPin, label: 'Address', value: '14, Gandhi Road, Coimbatore, Tamil Nadu — 641001' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'hello@crispynsnacky.in' },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat, 9 AM – 6 PM IST' },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center border"
                  style={{ borderColor: BORDER, background: CARD }}
                >
                  <Icon className="w-4 h-4 stroke-[2]" style={{ color: GREEN }} />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: MUTED_FG }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: FG }}>{value}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Bulk enquiry box */}
          <div className="p-6 border" style={{ background: CARD, borderColor: BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📦</span>
              <p className="text-sm font-black uppercase tracking-wide" style={{ color: GOLD }}>Bulk & Wholesale</p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: MUTED_FG }}>
              Stocking Crispy N Snacky in your café, hotel, or store?
              Write to us at{' '}
              <span style={{ color: GREEN }} className="font-bold">wholesale@crispynsnacky.in</span>
              {' '}with your requirements.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-6" style={{ color: GREEN }}>— Send a Message</p>

          {submitted ? (
            <div
              className="p-10 border text-center"
              style={{ background: CARD, borderColor: GREEN }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2"
                style={{ borderColor: GREEN, color: GREEN }}
              >
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)', color: GREEN }}>
                Message Sent!
              </h3>
              <p className="text-sm" style={{ color: MUTED_FG }}>
                Thanks, <span style={{ color: FG }}>{form.name}</span>! We'll reply to{' '}
                <span style={{ color: FG }}>{form.email}</span> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Your Name', type: 'text', placeholder: 'e.g. Priya Sharma' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'priya@example.com' },
                { id: 'subject', label: 'Subject', type: 'text', placeholder: 'Order query, wholesale, partnership…' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-[10px] font-black uppercase tracking-widest mb-1.5"
                    style={{ color: MUTED_FG }}
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    required
                    value={form[id as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                    className="w-full px-4 py-3 text-sm border outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = GREEN)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] font-black uppercase tracking-widest mb-1.5"
                  style={{ color: MUTED_FG }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help…"
                  required
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 text-sm border outline-none resize-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = GREEN)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 text-xs font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: GREEN, color: 'hsl(0 0% 5%)' }}
              >
                Send Message →
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}
