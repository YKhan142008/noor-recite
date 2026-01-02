import { SearchInterface } from "@/components/search/search-interface";

export default function SearchPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Search the Quran</h1>
        <p className="text-muted-foreground">Find guidance and clarity by searching for topics, words, or verse numbers.</p>
      </div>
      <SearchInterface />
    </div>
  );
}
