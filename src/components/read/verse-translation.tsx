
type VerseTranslationProps = {
    translation?: string;
    author?: string;
    source?: string;
};

export function VerseTranslation({ translation, author, source }: VerseTranslationProps) {
    if (!translation) {
        return null;
    }

    return (
        <div className='text-left pt-6 border-t border-dashed mt-6' dir="ltr">
            <p className="mt-4 text-foreground/80 leading-relaxed">{translation}</p>
            {author && source && (
                 <p className="mt-2 text-sm text-muted-foreground italic">
                    — {author}, {source}
                </p>
            )}
        </div>
    );
}
