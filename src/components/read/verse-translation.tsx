
import { translations } from '@/lib/data';
import type { Translation } from '@/lib/types';

type VerseTranslationProps = {
    translation: string;
    selectedTranslationId: string;
};

export function VerseTranslation({ translation, selectedTranslationId }: VerseTranslationProps) {
    const selectedTranslationMeta = translations.find(
        t => t.id.toString() === selectedTranslationId
    );

    if (!translation || !selectedTranslationMeta) {
        return null;
    }

    return (
        <div className='text-left pt-6 border-t border-dashed mt-6' dir="ltr">
            <p className="mt-4 text-foreground/80 leading-relaxed">{translation}</p>
            <p className="mt-2 text-sm text-muted-foreground italic">
                — {selectedTranslationMeta.author_name}, {selectedTranslationMeta.name}
            </p>
        </div>
    );
}
