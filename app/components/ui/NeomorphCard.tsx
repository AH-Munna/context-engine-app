import * as React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  getAndroidElevationForSurface,
  getNeomorphCardStyle,
  getSurfaceShadowStyle,
  pickBorderRadii,
  resolveShadowRadius,
} from '../../constants/shadows';
import {SIZES} from '../../constants/theme';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inner?: boolean;
  swapShadows?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
  fixed?: boolean;
  flat?: boolean;
  width?: number | string;
  height?: number;
};

const NeomorphCard = ({
  children,
  style,
  containerStyle,
  onPress,
  onLongPress,
  activeOpacity = 0.85,
  disabled,
  flat,
  width,
  height,
}: Props) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const flatStyle = StyleSheet.flatten(style) ?? {};
  const isDark = !!theme.dark;
  const cardDefaults = getNeomorphCardStyle(colors, isDark, {
    borderRadius:
      typeof flatStyle.borderRadius === 'number' ? flatStyle.borderRadius : undefined,
    backgroundColor:
      typeof flatStyle.backgroundColor === 'string'
        ? flatStyle.backgroundColor
        : undefined,
  });
  const {backgroundColor: defaultBg, borderRadius: defaultRadiusRaw} = cardDefaults;
  const defaultRadius =
    typeof defaultRadiusRaw === 'number' ? defaultRadiusRaw : SIZES.radius;
  const surfaceShadow = getSurfaceShadowStyle(isDark);
  const styleForRadius = flatStyle as ViewStyle;
  const radii = pickBorderRadii(styleForRadius, defaultRadius);
  const resolvedRadius = resolveShadowRadius(styleForRadius, defaultRadius);
  const resolvedBg =
    (typeof flatStyle.backgroundColor === 'string'
      ? flatStyle.backgroundColor
      : undefined) ?? defaultBg;

  const cardSurfaceStyle: ViewStyle = {
    overflow: 'hidden',
    ...radii,
    ...(resolvedRadius != null && radii.borderRadius == null
      ? {borderRadius: resolvedRadius}
      : null),
    ...flatStyle,
    backgroundColor: resolvedBg,
    ...(width != null ? {width: width as ViewStyle['width']} : null),
    ...(height != null ? {height} : null),
  };

  const shadowLayerStyle: ViewStyle = flat
    ? {}
    : {
        shadowColor: surfaceShadow.shadowColor,
        shadowOffset: surfaceShadow.shadowOffset,
        shadowOpacity: surfaceShadow.shadowOpacity,
        shadowRadius: surfaceShadow.shadowRadius ?? 8,
        ...radii,
        ...(resolvedRadius != null && radii.borderRadius == null
          ? {borderRadius: resolvedRadius}
          : null),
        backgroundColor: resolvedBg,
        ...(Platform.OS === 'android'
          ? {
              elevation: getAndroidElevationForSurface(
                surfaceShadow.shadowRadius ?? 3,
                surfaceShadow.shadowOpacity ?? 0,
                resolvedRadius,
              ),
            }
          : null),
      };

  const content =
    onPress || onLongPress ? (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        style={cardSurfaceStyle}>
        {children}
      </TouchableOpacity>
    ) : (
      <View style={cardSurfaceStyle}>{children}</View>
    );

  return (
    <View style={containerStyle}>
      {flat ? content : <View style={shadowLayerStyle}>{content}</View>}
    </View>
  );
};

export default NeomorphCard;
