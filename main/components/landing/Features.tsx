'use client';

import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '📝', title: 'Draft Management', description: 'Create, edit, and refine posts.' },
  { icon: '⏰', title: 'Smart Scheduling', description: 'Queue posts weeks ahead.' },
  { icon: '🚀', title: 'Auto-Publishing', description: 'Set it and forget it.' },
  { icon: '📊', title: 'Success Tracking', description: 'Monitor publish status.' },
  { icon: '🔄', title: 'Retry Logic', description: 'Automatic retry on failure.' },
  { icon: '🎯', title: 'Approval Flow', description: 'Review before publishing.' },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-6xl mb-4">
              Everything you need to
              <br />
              <span className="text-[var(--color-primary-500)]">dominate LinkedIn</span>
            </h2>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Built for creators who take their content seriously
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '📝',
                title: 'Draft Management',
                description: 'Create, edit, and refine posts with our intuitive editor. Never lose your ideas.',
              },
              {
                icon: '⏰',
                title: 'Smart Scheduling',
                description: 'Queue posts weeks in advance. Publish at optimal times automatically.',
              },
              {
                icon: '🚀',
                title: 'Auto-Publishing',
                description: 'Set it and forget it. Your content goes live exactly when planned.',
              },
              {
                icon: '📊',
                title: 'Success Tracking',
                description: 'Monitor publish status, failures, and retries in real-time.',
              },
              {
                icon: '🔄',
                title: 'Retry Logic',
                description: 'Automatic retry with exponential backoff if publishing fails.',
              },
              {
                icon: '🎯',
                title: 'Approval Flow',
                description: 'Review and approve drafts before they go live. Full control.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card hover:border-[var(--color-primary-300)] transition-all group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="font-display text-xl mb-3">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
    </section>
  );
}
