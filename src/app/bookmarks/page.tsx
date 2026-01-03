'use client';

import { useBookmarks } from '@/context/BookmarkContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">My Bookmarks</h1>
        <p className="text-muted-foreground">Verses you have saved for quick access.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">You have no bookmarks yet.</p>
          <Button asChild>
            <Link href="/read">Start Reading & Bookmarking</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const [surahId, verseNum] = bookmark.verse_key.split(':');
            return (
              <Card key={bookmark.verse_key} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-body">
                    {bookmark.surahName} ({bookmark.verse_key})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                     <Button asChild variant="ghost" size="icon">
                        <Link href={`/read?surah=${surahId}&verse=${verseNum}`}>
                            <BookOpen className="text-muted-foreground" />
                        </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bookmark.verse_key)}
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-arabic text-right leading-relaxed" dir="rtl">
                    {bookmark.text}
                    <span className="text-base mx-2 text-accent font-sans p-1 rounded-full border-2 border-accent w-6 h-6 inline-flex items-center justify-center">
                        {Number(verseNum).toLocaleString('ar-SA')}
                    </span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
