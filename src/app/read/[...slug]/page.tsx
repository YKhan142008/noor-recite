
'use client';

import { useState } from 'react';
import { QuranReader } from "@/components/read/quran-reader";
import { SurahSidebar } from "@/components/read/surah-sidebar";
import { allSurahs } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type ReadPageProps = {
  params: {
    slug: string[];
  }
}

export default function ReadPage({ params: { slug } }: ReadPageProps) {
  const surahId = slug?.[0] || '1';
  const [currentPage, setCurrentPage] = useState(1);
  const currentSurah = allSurahs.find(s => s.id.toString() === surahId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="hidden lg:block fixed top-0 left-0 h-full">
        <SurahSidebar currentSurahId={surahId} />
      </div>
      <div className="lg:pl-80 flex-1 flex flex-col">
        <div className="sticky top-[56px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="lg:hidden">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                             <Button variant="outline">
                                <BookOpen className="mr-2" />
                                <span>{currentSurah?.englishName || 'Select Surah'}</span>
                                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", isSidebarOpen && "rotate-180")} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-full max-w-sm">
                            <SheetHeader className="p-4 border-b text-left">
                                <SheetTitle>Select a Surah</SheetTitle>
                            </SheetHeader>
                            <SurahSidebar currentSurahId={surahId} isSheet={true} onSelect={() => setIsSidebarOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </div>
                 <div className="hidden lg:block">
                    <h2 className="font-headline text-lg">{currentSurah?.englishName}</h2>
                </div>
                <div>
                    <span className="text-sm text-muted-foreground">Page {currentPage}</span>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-0 sm:px-0 lg:px-0">
            <QuranReader params={{ slug: slug || [] }} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
