
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allSurahs } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSurahProgress } from '@/context/SurahProgressContext';

type SurahSidebarProps = {
  currentSurahId: string;
  isSheet?: boolean;
  onSelect?: () => void;
};

export function SurahSidebar({ currentSurahId, isSheet = false, onSelect }: SurahSidebarProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { progress } = useSurahProgress();

  const filteredSurahs = allSurahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(search.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(search.toLowerCase()) ||
      surah.id.toString().includes(search)
  );

  const handleSurahSelect = (surahId: number) => {
    router.push(`/read/${surahId}`);
    if (onSelect) {
      onSelect();
    }
  }

  const SurahListItem = ({ surah }: { surah: (typeof allSurahs)[0] }) => {
    const surahProgress = progress[surah.id] || 0;
    return (
      <Button
        variant={currentSurahId === surah.id.toString() ? 'secondary' : 'ghost'}
        className="w-full justify-start rounded-none px-4 py-6 text-left h-auto relative"
        onClick={() => handleSurahSelect(surah.id)}
      >
        <div 
          className="absolute inset-y-0 left-0 bg-primary/20"
          style={{ width: `${surahProgress}%`}}
        />
        <div className="flex items-center w-full relative">
          <span className="text-lg font-bold w-12">{surah.id}</span>
          <div className="flex-1">
            <p className="font-headline text-base">{surah.englishName}</p>
            <p className="text-sm text-muted-foreground">{surah.name}</p>
          </div>
        </div>
      </Button>
    )
  }

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <Input
          placeholder="Search Surah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className={isSheet ? "h-[calc(100vh-120px)]" : "flex-1"}>
        <div className="py-2">
          {filteredSurahs.map((surah) => (
            <SurahListItem key={surah.id} surah={surah} />
          ))}
        </div>
      </ScrollArea>
    </>
  )

  if (isSheet) {
    return <SidebarContent />;
  }

  return (
    <div className="hidden lg:flex flex-col w-80 border-r bg-muted/20 h-full">
      <SidebarContent />
    </div>
  );
}
