'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <motion.div 
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="/icon.png"
                    alt="ContentAIx logo"
                    className="h-9 w-auto object-contain"
                  />
                </motion.div>
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
  );
}
