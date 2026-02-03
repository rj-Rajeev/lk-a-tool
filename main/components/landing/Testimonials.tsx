'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote:
      'ContentAIx transformed my LinkedIn strategy. I went from posting once a week to daily engagement - and my profile views increased 300%.',
    author: 'Sarah Chen',
    role: 'Product Manager',
  },
  {
    quote:
      'The AI-powered content suggestions are incredible. It understands my brand voice and saves me 10+ hours every week.',
    author: 'Marcus Rodriguez',
    role: 'Tech Founder',
  },
  {
    quote:
      'Finally, a tool that combines automation with quality. My posts feel authentic, not robotic.',
    author: 'Priya Sharma',
    role: 'Marketing Director',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl text-center mb-16"
        >
          Loved by{' '}
          <span className="text-[var(--color-primary-500)]">creators</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className="text-[var(--color-primary-500)] text-4xl mb-4">
                "
              </div>
              <p className="text-[var(--color-text-primary)] mb-6 leading-relaxed">
                {t.quote}
              </p>
              <div>
                <div className="font-semibold">{t.author}</div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
