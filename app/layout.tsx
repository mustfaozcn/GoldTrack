// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { LanguageProvider } from '@/contexts/language-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Gold Calculator',
    description: 'Calculate gold values in different currencies',
};

// app/layout.tsx
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
            <LanguageProvider>
                <div className="flex min-h-screen flex-col">
                    <Navigation />
                    <main className="flex-grow flex flex-col">
                        {children}
                    </main>
                    <Footer />
                </div>
            </LanguageProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
