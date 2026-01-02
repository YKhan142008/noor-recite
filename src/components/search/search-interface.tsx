'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { searchResults } from '@/lib/data';

export function SearchInterface() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="search"
          placeholder="e.g. 'forgiveness' or '2:255'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {showResults && (
        <div className="space-y-4">
          <h2 className="text-xl font-headline font-semibold">
            Showing results for "{query}"
          </h2>
          {searchResults.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg font-body">
                  {result.surah}:{result.verse}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">"{result.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
