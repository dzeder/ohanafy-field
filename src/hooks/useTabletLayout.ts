import { useWindowDimensions } from 'react-native';

export interface TabletLayout {
  isTablet: boolean;
  isMediumTablet: boolean;
  isLargeTablet: boolean;
  isLandscape: boolean;
  splitPaneLeftWidth: number;
}

// Width thresholds match the Bible §15 spec — 768/1024/1280pt.
// Used by every screen that supports a master-detail tablet layout.
export function useTabletLayout(): TabletLayout {
  const { width, height } = useWindowDimensions();
  return {
    isTablet: width >= 768,
    isMediumTablet: width >= 1024,
    isLargeTablet: width >= 1280,
    isLandscape: width > height,
    splitPaneLeftWidth: Math.min(380, Math.max(320, width * 0.32)),
  };
}
