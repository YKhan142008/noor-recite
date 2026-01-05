
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// This component handles the base /read route and redirects to the first Surah.
export default function ReadRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/read/1');
  }, [router]);

  // Return a loading state while the redirect is happening.
  return (
     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
