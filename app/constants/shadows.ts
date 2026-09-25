import {StyleSheet, ViewStyle} from 'react-native';
import {COLORS, SIZES} from './theme';

type ThemeColors = {
  card?: string;
  cardBg?: string;
  title?: string;
  text?: string;
  background?: string;
};

type NeomorphStyleOptions = {
  borderRadius?: number;
  backgroundColor?: string;
  shadowRadius?: number;
  padding?: number;
};

type SoftShadowOptions = {
  shadowColor?: string;
  shadowOffset?: {width: number; height: number};
  shadowOpacity?: number;
  shadowRadius?: number;
  borderRadius?: number;
  backgroundColor?: string;
  inner?: boolean;
};

const RADIUS_KEYS = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
] as const;

/** Copy explicit corner radii from a flattened style object. */
export function pickBorderRadii(
  style?: ViewStyle | null,
  fallbackRadius?: number,
): ViewStyle {
  const flat = style ? StyleSheet.flatten(style) : {};
  const radii: ViewStyle = {};
  for (const key of RADIUS_KEYS) {
    const value = flat[key];
    if (value != null) {
      radii[key] = value;
    }
  }
  if (fallbackRadius != null && radii.borderRadius == null) {
    radii.borderRadius = fallbackRadius;
  }
  return radii;
}

/** Best single radius value for shadow/elevation clipping. */
export function resolveShadowRadius(
  style?: ViewStyle | null,
  fallbackRadius?: number,
): number | undefined {
  const flat = style ? StyleSheet.flatten(style) : {};
  if (flat.borderRadius != null) {
    return flat.borderRadius as number;
  }
  if (fallbackRadius != null) {
    return fallbackRadius;
  }
  const corners = [
    flat.borderTopLeftRadius,
    flat.borderTopRightRadius,
    flat.borderBottomLeftRadius,
    flat.borderBottomRightRadius,
  ].filter(v => v != null) as number[];
  if (corners.length > 0) {
    return Math.max(...corners);
  }
  return SIZES.radius;
}

/** Map iOS shadow blur to Android elevation for rounded surfaces. */
export function getAndroidElevation(shadowRadius = 3, opacity = 0.08): number {
  if (opacity <= 0) {
    return 0;
  }
  return Math.min(12, Math.max(1, Math.round(shadowRadius * 0.75)));
}

/** Android elevation ignores corner radius — skip it on rounded surfaces. */
export function getAndroidElevationForSurface(
  shadowRadius = 3,
  opacity = 0.08,
  borderRadius?: number,
): number {
  if (opacity <= 0) {
    return 0;
  }
  if (borderRadius != null && borderRadius > 0) {
    return 0;
  }
  return getAndroidElevation(shadowRadius, opacity);
}

export function getNeomorphShadowColors(isDark: boolean) {
  if (isDark) {
    return {
      darkShadowColor: 'rgba(0,0,0,0.45)',
      lightShadowColor: 'rgba(255,255,255,0.06)',
    };
  }
  return {
    darkShadowColor: 'rgba(0,0,0,0.12)',
    lightShadowColor: 'rgba(255,255,255,0.95)',
  };
}

export function getNeomorphCardStyle(
  colors: ThemeColors,
  isDark: boolean,
  options: NeomorphStyleOptions = {},
): ViewStyle & {
  darkShadowColor: string;
  lightShadowColor: string;
} {
  const shadowColors = getNeomorphShadowColors(isDark);
  return {
    backgroundColor: options.backgroundColor ?? colors.card ?? COLORS.white,
    borderRadius: options.borderRadius ?? SIZES.radius,
    shadowRadius: options.shadowRadius ?? 8,
    shadowOpacity: isDark ? 0.28 : 0.28,
    ...shadowColors,
  };
}

/** Flat surface shadow — shared by SoftShadow, NeomorphCard, tabs, inputs */
export function getSurfaceShadowStyle(isDark: boolean): SoftShadowOptions {
  return {
    shadowColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(43,38,64,0.08)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: isDark ? 0.20 : 0.08,
    shadowRadius: 6,
  };
}

export function getSoftShadowStyle(
  options: SoftShadowOptions = {},
  isDark = false,
): ViewStyle {
  const surface = getSurfaceShadowStyle(isDark);
  return {
    shadowOffset: options.shadowOffset ?? surface.shadowOffset,
    shadowOpacity: options.shadowOpacity ?? surface.shadowOpacity,
    shadowColor: options.shadowColor ?? surface.shadowColor,
    shadowRadius: options.shadowRadius ?? surface.shadowRadius,
    borderRadius: options.borderRadius,
    backgroundColor: options.backgroundColor,
  };
}

export function getButtonShadowStyle(
  disabled?: boolean,
  btnLight?: boolean,
): SoftShadowOptions {
  if (disabled || btnLight) {
    return {
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: {width: 0, height: 0},
    };
  }
  return {
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.24,
    shadowRadius: 10,
    borderRadius: SIZES.radius,
  };
}

export function getHeaderShadowStyle(enabled: boolean): SoftShadowOptions {
  if (!enabled) {
    return {
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: {width: 0, height: 0},
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
  };
}

export function getFloatingShadowStyle(
  variant: 'card' | 'floating' | 'sheet' = 'card',
) {
  switch (variant) {
    case 'floating':
      return getSoftShadowStyle({
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.18,
        shadowRadius: 12,
      });
    case 'sheet':
      return getSoftShadowStyle({
        shadowOffset: {width: 0, height: -6},
        shadowOpacity: 0.18,
        shadowRadius: 14,
      });
    default:
      return getNeomorphCardStyle({card: COLORS.white}, false, {
        shadowRadius: 8,
      });
  }
}

/** @deprecated Use NeomorphCard / SoftShadow wrappers instead */
export const legacyShadowStyle: ViewStyle = {
  shadowColor: 'rgba(0,0,0,.5)',
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
};
