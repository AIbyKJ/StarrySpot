
import type { FC } from 'react';
import { MoonStar } from 'lucide-react';

const StarrySpotHeader: FC = () => {
  return (
    <header className="py-6 px-4 md:px-6 bg-background border-b border-border/50 shadow-md">
      <div className="container mx-auto flex items-center gap-3">
        <MoonStar className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          StarrySpot
        </h1>
      </div>
    </header>
  );
};

export default StarrySpotHeader;
