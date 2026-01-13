// app/client-providers.tsx
"use client";

import { BookmarkProvider } from '@/context/BookmarkContext';
import { SurahProgressProvider } from '@/context/SurahProgressContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SurahProgressProvider>
      <BookmarkProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </BookmarkProvider>
    </SurahProgressProvider>
  );
}
