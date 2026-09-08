import * as React from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  getAndroidElevationForSurface,
  getSoftShadowStyle,
  pickBorderRadii,
  resolveShadowRadius,
} from '../../constants/shadows';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inner?: boolean;
  disabled?: boolean;
  flex?: boolean;
  shadowColor?: string;
  shadowOffset?: {width: number; height: number};
  shadowOpacity?: number;
  shadowRadius?: number;
  borderRadius?: number;
  backgroundColor?: string;
};

const SoftShadow = ({
  children,
  style,
  containerStyle,
  disabled,
  flex,
  shadowColor,
  shadowOffset,
  shadowOpacity,
  shadowRadius,
  borderRadius,
  backgroundColor,
}: Props) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const flatStyle = StyleSheet.flatten(style) ?? {};
  const isDark = !!theme.dark;

  const resolvedBg =
    backgroundColor ??
    (flatStyle.backgroundColor as string | undefined) ??
    colors.card;

  const radii = pickBorderRadii(flatStyle, borderRadius);
  const resolvedRadius = resolveShadowRadius(flatStyle, borderRadius);

  const surfaceStyle: ViewStyle = {
    overflow: 'hidden',
    ...radii,
    ...(resolvedRadius != null && radii.borderRadius == null
      ? {borderRadius: resolvedRadius}
      : null),
    ...flatStyle,
    backgroundColor: resolvedBg,
  };

  const effectiveOpacityRaw =
    shadowOpacity ?? (disabled ? 0 : getSoftShadowStyle({}, isDark).shadowOpacity);
  const opacityNum = typeof effectiveOpacityRaw === 'number' ? effectiveOpacityRaw : 0;
  const effectiveRadius =
    shadowRadius ?? getSoftShadowStyle({}, isDark).shadowRadius ?? 3;
  const showShadow = !disabled && opacityNum > 0;

  const shadowLayerStyle: ViewStyle = showShadow
    ? {
        ...getSoftShadowStyle(
          {
            shadowColor,
            shadowOffset,
            shadowOpacity: opacityNum,
            shadowRadius: effectiveRadius,
            borderRadius: resolvedRadius,
            backgroundColor: resolvedBg,
          },
          isDark,
        ),
        ...radii,
        ...(resolvedRadius != null && radii.borderRadius == null
          ? {borderRadius: resolvedRadius}
          : null),
        backgroundColor: resolvedBg,
        ...(Platform.OS === 'android'
          ? {
              elevation: getAndroidElevationForSurface(
                effectiveRadius,
                opacityNum,
                resolvedRadius,
              ),
            }
          : null),
      }
    : {
        ...radii,
        ...(resolvedRadius != null && radii.borderRadius == null
          ? {borderRadius: resolvedRadius}
          : null),
      };

  return (
    <View style={[containerStyle, flex ? {alignSelf: 'stretch'} : null]}>
      <View style={[shadowLayerStyle, flex ? {alignSelf: 'stretch'} : null]}>
        <View style={surfaceStyle}>{children}</View>
      </View>
    </View>
  );
};

export default SoftShadow;
