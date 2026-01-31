'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

// Design Direction: "Confident Minimalism with Kinetic Energy"
// - Uses your exact theme system (CSS variables)
// - Soft yellow-green accent (primary-500)
// - Bold, asymmetric layouts
// - Fluid motion that feels alive
// - Light mode optimized (can add dark mode toggle)

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] overflow-x-hidden">
      {/* Custom Display Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        
        .font-display {
          font-family: 'Space Grotesk', var(--font-sans);
          font-weight: 700;
        }
      `}</style>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--color-surface)]/95 border-b border-[var(--color-border)]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="font-display text-xl">ContentAI<span className="text-[var(--color-primary-500)]">x</span></span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Start Free Trial
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span 
                  animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 8 : 0 }}
                  className="w-full h-0.5 bg-[var(--color-text-primary)] rounded-full"
                />
                <motion.span 
                  animate={{ opacity: isMenuOpen ? 0 : 1 }}
                  className="w-full h-0.5 bg-[var(--color-text-primary)] rounded-full"
                />
                <motion.span 
                  animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : 0 }}
                  className="w-full h-0.5 bg-[var(--color-text-primary)] rounded-full"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="px-6 py-6 space-y-4">
                <a href="#features" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Features</a>
                <a href="#how-it-works" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">How it works</a>
                <a href="#pricing" className="block text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Pricing</a>
                <button className="btn-primary w-full">
                  Start Free Trial
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
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

      {/* Social Proof */}
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
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company, i) => (
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

      {/* Features Section */}
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

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 bg-[var(--color-surface-2)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-6xl mb-4">
              Simple. Powerful. <span className="text-[var(--color-primary-500)]">Automated.</span>
            </h2>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Create Your Content',
                description: 'Write your posts in our intuitive editor. Format, add hashtags, and save as drafts.',
              },
              {
                step: '02',
                title: 'Schedule & Approve',
                description: 'Pick the perfect time slots. Review and approve each post before it goes live.',
              },
              {
                step: '03',
                title: 'Relax & Grow',
                description: 'Our system publishes automatically. Track performance and watch your audience grow.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
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
                  <h3 className="font-display text-2xl md:text-3xl mb-3">{step.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-center mb-16"
          >
            Loved by <span className="text-[var(--color-primary-500)]">creators</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "ContentAIx transformed my LinkedIn strategy. I went from posting once a week to daily engagement - and my profile views increased 300%.",
                author: "Sarah Chen",
                role: "Product Manager",
              },
              {
                quote: "The AI-powered content suggestions are incredible. It understands my brand voice and saves me 10+ hours every week.",
                author: "Marcus Rodriguez",
                role: "Tech Founder",
              },
              {
                quote: "Finally, a tool that combines automation with quality. My posts feel authentic, not robotic.",
                author: "Priya Sharma",
                role: "Marketing Director",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
              >
                <div className="text-[var(--color-primary-500)] text-4xl mb-4">"</div>
                <p className="text-[var(--color-text-primary)] mb-6 leading-relaxed">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
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

      {/* Final CTA */}
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
              your <span className="text-[var(--color-primary-500)]">LinkedIn</span>?
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

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary-500)]" />
                <span className="font-display text-lg">ContentAI<span className="text-[var(--color-primary-500)]">x</span></span>
              </div>
              <p className="text-[var(--color-text-muted)] text-sm">
                AI-powered LinkedIn automation for modern creators
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              © 2026 ContentAIx. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}