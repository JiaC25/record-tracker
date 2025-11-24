'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings2Icon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

export type LayoutType = 'left-right' | 'top-bottom';

type RecordLayoutConfigPopoverProps = {
  layout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
};

export const RecordLayoutConfigPopover = ({
  layout,
  onLayoutChange,
}: RecordLayoutConfigPopoverProps) => {
  const isLg = useMediaQuery('(min-width: 1024px)');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings2Icon />
          Config
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Layout</Label>
            <div className="space-y-2">
              <button
                onClick={() => onLayoutChange('left-right')}
                className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                  layout === 'left-right'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent border-input'
                }`}
              >
                <div className="text-sm font-medium">Left / Right</div>
                <div className="text-xs opacity-80 mt-0.5">
                  Data table left, Analytics right
                </div>
              </button>
              <button
                onClick={() => onLayoutChange('top-bottom')}
                disabled={!isLg}
                className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                  !isLg
                    ? 'opacity-50 cursor-not-allowed'
                    : layout === 'top-bottom'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent border-input'
                }`}
              >
                <div className="text-sm font-medium">Top / Bottom</div>
                <div className="text-xs opacity-80 mt-0.5">
                  {!isLg
                    ? 'Available on large screens only'
                    : 'Data table top, Analytics bottom'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

