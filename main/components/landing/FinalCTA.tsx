'use client';

import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-5xl md:text-7xl mb-6">
            Ready to transform
            <br />
            your{' '}
            <span className="text-[var(--color-primary-500)]">LinkedIn</span>?
          </h2>

          <p className="text-xl text-[var(--color-text-secondary)] mb-12">
            Join 2,000+ professionals using AI to automate their LinkedIn content
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input sm:w-80"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full sm:w-auto px-8 py-3 shadow-[var(--shadow-md)]"
            >
              Start Free Trial →
            </motion.button>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] mt-6">
            14-day free trial • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
