import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Achievement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Lock, Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AchievementsGridProps = {
  achievements: Achievement[];
};

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const placeholder = PlaceHolderImages.find(p => p.id === achievement.imageId);
          return (
            <Tooltip key={achievement.id}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={cn(
                      'relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed p-1',
                      achievement.unlocked ? 'border-accent' : 'border-muted'
                    )}
                  >
                    {placeholder && (
                      <Image
                        src={placeholder.imageUrl}
                        alt={achievement.title}
                        width={72}
                        height={72}
                        data-ai-hint={placeholder.imageHint}
                        className={cn(
                          'rounded-full object-cover',
                          !achievement.unlocked && 'grayscale'
                        )}
                      />
                    )}
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white/70" />
                      </div>
                    )}
                    {achievement.unlocked && (
                         <div className="absolute -bottom-2 -right-1 bg-accent rounded-full p-1 border-2 border-card">
                            <Award className="w-4 h-4 text-accent-foreground" />
                        </div>
                    )}
                  </div>
                  <p className={cn(
                      "text-xs font-medium",
                      achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {achievement.title}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{achievement.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
