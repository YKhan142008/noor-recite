'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allSurahs } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, ChevronDown, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type SurahSidebarProps = {
  currentSurahId: string;
};

export function SurahSidebar({ currentSurahId }: SurahSidebarProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const filteredSurahs = allSurahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(search.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(search.toLowerCase()) ||
      surah.id.toString().includes(search)
  );
  
  const currentSurah = allSurahs.find(s => s.id.toString() === currentSurahId);

  const handleSurahSelect = (surahId: number) => {
    router.push(`/read/${surahId}`);
    setIsOpen(false);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-80 border-r bg-muted/20 h-screen sticky top-0">
        <div className="p-4 border-b">
          <Input
            placeholder="Search Surah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="flex-1">
          <div className="py-2">
            {filteredSurahs.map((surah) => (
              <Button
                key={surah.id}
                variant={currentSurahId === surah.id.toString() ? 'secondary' : 'ghost'}
                className="w-full justify-start rounded-none px-4 py-6 text-left"
                onClick={() => handleSurahSelect(surah.id)}
              >
                <div className="flex items-center w-full">
                  <span className="text-lg font-bold w-12">{surah.id}</span>
                  <div className="flex-1">
                    <p className="font-headline text-base">{surah.englishName}</p>
                    <p className="text-sm text-muted-foreground">{surah.name}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Sheet Trigger */}
      <div className="lg:hidden sticky top-[72px] z-30 flex justify-start p-4">
         <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <BookOpen className="mr-2" />
                    <span>{currentSurah?.englishName || 'Select Surah'}</span>
                    <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full max-w-sm">
                 <SheetHeader className="p-4 border-b text-left">
                     <SheetTitle>Select a Surah</SheetTitle>
                 </SheetHeader>
                <div className="p-4 border-b">
                    <Input
                        placeholder="Search Surah..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-[calc(100vh-120px)]">
                    <div className="py-2">
                    {filteredSurahs.map((surah) => (
                      <Button
                        key={surah.id}
                        variant={currentSurahId === surah.id.toString() ? 'secondary' : 'ghost'}
                        className="w-full justify-start rounded-none px-4 py-6 text-left"
                        onClick={() => handleSurahSelect(surah.id)}
                      >
                        <div className="flex items-center w-full">
                            <span className="text-lg font-bold w-12">{surah.id}</span>
                            <div className="flex-1">
                                <p className="font-headline text-base">{surah.englishName}</p>
                                <p className="text-sm text-muted-foreground">{surah.name}</p>
                            </div>
                        </div>
                      </Button>
                    ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
