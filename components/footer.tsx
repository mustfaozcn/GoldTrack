'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 bg-gradient-to-b from-transparent to-amber-50 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Gold Calculator. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mustfaozcn/GoldTrack"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-500 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
