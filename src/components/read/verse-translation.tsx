
import type { Verse, Translation } from '@/lib/types';

type VerseTranslationProps = {
    verse: Verse;
    translations: Translation[];
    selectedTranslationId: string;
};

export function VerseTranslation({ verse, translations, selectedTranslationId }: VerseTranslationProps) {
    let translationText: string | undefined;

    if (Array.isArray(verse.translations)) {
        const t = verse.translations.find(t => t.id.toString() === selectedTranslationId);
        translationText = t?.text;
    } else if (verse.translations) {
        translationText = verse.translations[selectedTranslationId];
    }

    const selectedTranslationMeta = translations.find(
        t => t.id.toString() === selectedTranslationId
    );

    if (!translationText || !selectedTranslationMeta) {
        return null;
    }

    return (
        <div className='text-left pt-6 border-t border-dashed mt-6' dir="ltr">
            <p className="mt-4 text-foreground/80 leading-relaxed">{translationText}</p>
            <p className="mt-2 text-sm text-muted-foreground italic">
                — {selectedTranslationMeta.author_name}, {selectedTranslationMeta.name}
            </p>
        </div>
    );
}
