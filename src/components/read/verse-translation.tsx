
import type { Verse, Translation } from '@/lib/types';

type VerseTranslationProps = {
    verse: Verse;
    translations: Translation[];
    selectedTranslationId: string;
};

export function VerseTranslation({ verse, translations, selectedTranslationId }: VerseTranslationProps) {
    const translationText = verse.translations?.[selectedTranslationId];
    const selectedTranslationMeta = translations.find(t => t.id.toString() === selectedTranslationId);

    if (!translationText || !selectedTranslationMeta) {
        return null;
    }

    return (
        <div className='text-left' dir="ltr">
            <p className="mt-4 text-foreground/80 leading-relaxed">{translationText}</p>
            <p className="mt-2 text-sm text-muted-foreground italic">
                — {selectedTranslationMeta.author_name}, {selectedTranslationMeta.name}
            </p>
        </div>
    );
}

    