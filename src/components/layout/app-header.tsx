'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Search } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { MosaicPattern } from '@/components/icons/mosaic-pattern';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/read', label: 'Read Quran', icon: BookOpen },
  { href: '/search', label: 'Search', icon: Search },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative container mx-auto flex h-14 max-w-screen-2xl items-center">
        <MosaicPattern />
        <div className="relative mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">NoorRecite</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary relative',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
