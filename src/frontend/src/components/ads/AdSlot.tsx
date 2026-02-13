import { useEffect, useRef } from 'react';
import { useAdSettings } from '../../hooks/useAdSettings';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  slot: 'top-banner' | 'in-results';
  className?: string;
}

export default function AdSlot({ slot, className }: AdSlotProps) {
  const { settings } = useAdSettings();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settings.enabled || !settings.publisherId || !adRef.current) {
      return;
    }

    try {
      // AdSense script injection would happen here in production
      // For now, we just show a placeholder when enabled
      console.log('AdSense slot ready:', slot, settings.publisherId);
    } catch (error) {
      console.error('Failed to load ad:', error);
    }
  }, [settings.enabled, settings.publisherId, slot]);

  if (!settings.enabled) {
    return null;
  }

  const slotConfig = {
    'top-banner': {
      height: 'h-24',
      label: 'Advertisement - Top Banner',
    },
    'in-results': {
      height: 'h-32',
      label: 'Advertisement',
    },
  };

  const config = slotConfig[slot];

  return (
    <div
      ref={adRef}
      className={cn(
        'w-full rounded-lg border border-border bg-muted/30 flex items-center justify-center',
        config.height,
        className
      )}
    >
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}
