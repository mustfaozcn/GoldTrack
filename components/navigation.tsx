'use client';

import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/contexts/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  // Varsayılan dil olarak 'tr' kullanıyoruz ve translations'ı kontrol ediyoruz
  const t = translations[language] || translations['tr'];

  const isActive = (path: string) => pathname === path;

  return (
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            {t.title || "Gold Calculator"}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
                href="/"
                className={`hover:text-amber-600 transition-colors ${isActive('/') ? 'text-amber-600' : ''}`}
            >
              {language === 'tr' ? 'Ana Sayfa' : 'Home'}
            </Link>
            <Link
                href="/about"
                className={`hover:text-amber-600 transition-colors ${isActive('/about') ? 'text-amber-600' : ''}`}
            >
              {language === 'tr' ? 'Hakkında' : 'About'}
            </Link>

            {/* Language Selector */}
            <Select
                value={language}
                onValueChange={(value: 'tr' | 'en') => setLanguage(value)}
            >
              <SelectTrigger className="w-[120px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className={`text-lg hover:text-amber-600 transition-colors ${isActive('/') ? 'text-amber-600' : ''}`}
                >
                  {language === 'tr' ? 'Ana Sayfa' : 'Home'}
                </Link>
                <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className={`text-lg hover:text-amber-600 transition-colors ${isActive('/about') ? 'text-amber-600' : ''}`}
                >
                  {language === 'tr' ? 'Hakkında' : 'About'}
                </Link>

                {/* Language Selector for Mobile */}
                <div className="pt-4">
                  <Select
                      value={language}
                      onValueChange={(value: 'tr' | 'en') => setLanguage(value)}
                  >
                    <SelectTrigger className="w-full">
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
  );
}
