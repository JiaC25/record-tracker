import { useState, useEffect, useCallback } from 'react';
import { LayoutType } from '@/components/records/record-layout-config-popover';

const LAYOUT_STORAGE_KEY = 'record-layout-preference';

export function useRecordLayout(): [LayoutType, (layout: LayoutType) => void] {
  const [layout, setLayout] = useState<LayoutType>('left-right');

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (stored === 'left-right' || stored === 'top-bottom') {
      setLayout(stored);
    }
  }, []);

  const updateLayout = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_STORAGE_KEY, newLayout);
  }, []);

  return [layout, updateLayout];
}

