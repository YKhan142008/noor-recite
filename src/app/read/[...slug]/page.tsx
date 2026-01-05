import { QuranReader } from "@/components/read/quran-reader";

type ReadPageProps = {
  params: {
    slug: string[];
  }
}

export default function ReadPage({ params }: ReadPageProps) {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Read Quran</h1>
        <p className="text-muted-foreground">Begin your spiritual journey, verse by verse.</p>
      </div>
      <QuranReader params={{ slug: params.slug || [] }} />
    </div>
  );
}
