'use client';

import { useState, useEffect } from 'react';
import { QuranReader } from "@/components/read/quran-reader";
import { SurahSidebar } from "@/components/read/surah-sidebar";
import { allSurahs } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, PanelLeftClose, PanelLeftOpen, Book, BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type ReadPageProps = {
  params: {
    slug?: string[];
  };
};

export default function ReadPage({ params }: ReadPageProps) {
  const slug = params.slug || [];
  const surahId = slug[0] || '1';
  const [currentPage, setCurrentPage] = useState(1);
  const currentSurah = allSurahs.find(s => s.id.toString() === surahId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isMushafMode, setIsMushafMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('mushafMode');
    if (savedMode) setIsMushafMode(JSON.parse(savedMode));
  }, []);

  const toggleMushafMode = () => {
    const newMode = !isMushafMode;
    setIsMushafMode(newMode);
    localStorage.setItem('mushafMode', JSON.stringify(newMode));
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block fixed top-0 left-0 h-full transition-all duration-300 border-r bg-background overflow-hidden",
          isDesktopSidebarCollapsed ? "w-0 border-none" : "w-80"
        )}
      >
        <SurahSidebar currentSurahId={surahId} isCollapsed={isDesktopSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isDesktopSidebarCollapsed ? "lg:pl-0" : "lg:pl-80"
        )}
      >
        <div className="sticky top-[56px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile Trigger */}
            <div className="lg:hidden">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <BookOpen className="mr-2" />
                    <span>{currentSurah?.englishName || 'Select Surah'}</span>
                    <ChevronDown
                      className={cn(
                        "ml-2 h-4 w-4 transition-transform",
                        isSidebarOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-full max-w-sm">
                  <SheetHeader className="p-4 border-b text-left">
                    <SheetTitle>Select a Surah</SheetTitle>
                  </SheetHeader>
                  <SurahSidebar
                    currentSurahId={surahId}
                    isSheet={true}
                    onSelect={() => setIsSidebarOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Toggle & Title */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
                title={isDesktopSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
              >
                {isDesktopSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMushafMode}
                title={isMushafMode ? "Show Translation" : "Mushaf Mode"}
              >
                {isMushafMode ? <BookOpenText className="h-5 w-5" /> : <Book className="h-5 w-5" />}
              </Button>
              <h2 className="font-headline text-lg ml-2">{currentSurah?.englishName}</h2>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Page {currentPage}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-0 sm:px-0 lg:px-0">
            <QuranReader
              slug={slug}
              setCurrentPage={setCurrentPage}
              isMushafMode={isMushafMode}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
