'use client';

import { motion } from 'framer-motion';

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'];

export default function SocialProof() {
  return (
    <section className="py-12 border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[var(--color-text-muted)] text-sm mb-8"
        >
          Trusted by professionals from
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="font-display text-xl text-[var(--color-text-secondary)] opacity-60"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
