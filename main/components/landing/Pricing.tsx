'use client';

import { motion } from 'framer-motion';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-6 bg-[var(--color-surface-2)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-6xl mb-4">
              Simple, <span className="text-[var(--color-primary-500)]">transparent</span> pricing
            </h2>
            <p className="text-xl text-[var(--color-text-secondary)]">Start free. Scale as you grow.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$0',
                period: 'forever',
                features: ['5 scheduled posts/month', 'Basic analytics', 'Email support'],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$29',
                period: 'per month',
                features: ['Unlimited posts', 'Advanced analytics', 'Priority support', 'Retry logic', 'Multi-account'],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'contact us',
                features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative card ${
                  plan.popular ? 'border-[var(--color-primary-500)] scale-105 shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary-500)] text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-display text-2xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl">{plan.price}</span>
                    <span className="text-[var(--color-text-muted)]">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[var(--color-text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-[var(--radius-md)] font-semibold transition-all ${
                    plan.popular
                      ? 'btn-primary shadow-[var(--shadow-md)]'
                      : 'btn-secondary hover:bg-[var(--color-surface-2)]'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
    </section>
  );
}
