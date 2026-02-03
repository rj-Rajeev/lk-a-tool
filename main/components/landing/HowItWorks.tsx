'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    step: '01',
    title: 'Create Your Content',
    description:
      'Write your posts in our intuitive editor. Format, add hashtags, and save as drafts.',
  },
  {
    step: '02',
    title: 'Schedule & Approve',
    description:
      'Pick the perfect time slots. Review and approve each post before it goes live.',
  },
  {
    step: '03',
    title: 'Relax & Grow',
    description:
      'Our system publishes automatically. Track performance and watch your audience grow.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 px-6 bg-[var(--color-surface-2)]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            Simple. Powerful.{' '}
            <span className="text-[var(--color-primary-500)]">Automated.</span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--color-primary-500)] flex items-center justify-center font-display text-2xl text-white shadow-[var(--shadow-md)]">
                  {step.step}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-display text-2xl md:text-3xl mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
