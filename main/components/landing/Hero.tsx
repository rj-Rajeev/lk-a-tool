'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary-100)] opacity-30 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-100)] opacity-20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-50)] border border-[var(--color-primary-300)] mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary-500)] animate-pulse" />
              <span className="text-sm text-[var(--color-text-secondary)]">Trusted by 2,000+ LinkedIn creators</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-6 text-[var(--color-text-primary)]"
            >
              AI-Powered
              <br />
              <span className="text-[var(--color-primary-500)]">
                LinkedIn Content
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Create, schedule, and publish engaging LinkedIn posts automatically. 
              Let AI handle your content while you focus on growing your business.
            </motion.p>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="relative w-full sm:w-auto">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input sm:w-80"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary w-full sm:w-auto px-8 py-3 shadow-[var(--shadow-md)]"
              >
                Start Free Trial →
              </motion.button>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-sm text-[var(--color-text-muted)] mt-4"
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ opacity, scale }}
            className="mt-20 relative"
          >
            <div className="card relative overflow-hidden">
              {/* Fake Browser Chrome */}
              <div className="bg-[var(--color-surface-2)] px-4 py-3 flex items-center gap-2 border-b border-[var(--color-border)]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              
              {/* Dashboard Screenshot Placeholder */}
              <div className="bg-[var(--color-bg)] p-8 aspect-[16/10]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  {/* Stats Cards */}
                  {[
                    { label: 'Scheduled Posts', value: '24', trend: '+12%' },
                    { label: 'Success Rate', value: '99.2%', trend: '+2.1%' },
                    { label: 'Time Saved', value: '8.5h', trend: '+3h' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="card bg-[var(--color-surface)]"
                    >
                      <div className="label mb-2">{stat.label}</div>
                      <div className="font-display text-3xl mb-2">{stat.value}</div>
                      <div className="text-[var(--color-primary-500)] text-sm font-medium">{stat.trend} this week</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-[var(--color-primary-500)] rounded-[var(--radius-xl)] p-4 shadow-[var(--shadow-md)] hidden lg:block"
            >
              <div className="text-white font-semibold">✓ Post Published</div>
            </motion.div>
          </motion.div>
        </div>
    </section>
  );
}
