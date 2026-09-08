import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/theme';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
  /** When false, children render without ScrollView wrapper. */
  scrollable?: boolean;
  maxHeight?: number | `${number}%`;
  sheetStyle?: StyleProp<ViewStyle>;
  bodyContentStyle?: StyleProp<ViewStyle>;
  /** Lifts the sheet above the keyboard (overlay padding). Android legacy
   * passes this without sheetPaddingBottom to pad inside the sheet instead. */
  overlayPaddingBottom?: number;
  /** Fixed backdrop strip above the sheet. Keeps the sheet's top edge still
   * when the window shrinks for the keyboard, unlike a percentage height. */
  overlayPaddingTop?: number;
  /** Inner safe-area padding at the bottom of the sheet chrome (iOS keyboard). */
  sheetPaddingBottom?: number;
};

const BottomSheet = ({
  visible,
  onClose,
  title,
  subtitle,
  showBack = false,
  onBack,
  children,
  scrollable = true,
  maxHeight = '82%',
  sheetStyle,
  bodyContentStyle,
  overlayPaddingBottom,
  overlayPaddingTop,
  sheetPaddingBottom,
}: BottomSheetProps) => {
  const theme = useTheme();
  const {colors, dark}: {colors: any; dark: boolean} = theme;
  const insets = useSafeAreaInsets();

  const sheetBg = dark ? '#111111' : COLORS.offWhite;
  const handleColor = dark ? 'rgba(255,255,255,0.2)' : '#D8D2C8';
  const titleColor = colors.title;
  const subtitleColor = colors.textLight;
  const headerBtnBg = dark ? '#1C1C1E' : '#FFFFFF';
  const headerBtnBorder = colors.border || '#E8E4DC';
  const iconColor = colors.title;

  const usesSplitKeyboardPadding = sheetPaddingBottom != null;

  const bottomPad =
    sheetPaddingBottom ??
    (overlayPaddingBottom != null && !usesSplitKeyboardPadding
      ? overlayPaddingBottom
      : undefined) ??
    Math.max(insets.bottom, Platform.OS === 'ios' ? 28 : 20);

  const overlayBottomPad =
    usesSplitKeyboardPadding && overlayPaddingBottom != null
      ? overlayPaddingBottom
      : undefined;

  const sheetSizeStyle: ViewStyle = usesSplitKeyboardPadding
    ? maxHeight === '100%'
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
          top: overlayPaddingTop ?? 0,
          bottom: overlayBottomPad ?? 0,
        }
      : {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: overlayBottomPad ?? 0,
          maxHeight,
        }
    : typeof maxHeight === 'number'
      ? {height: maxHeight, maxHeight}
      : maxHeight === '100%'
        ? {height: '100%', maxHeight: '100%'}
        : {maxHeight};

  const body = scrollable ? (
    <ScrollView
      style={[st.body, usesSplitKeyboardPadding && st.bodyFill]}
      contentContainerStyle={[st.bodyContent, bodyContentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        st.body,
        st.bodyContent,
        usesSplitKeyboardPadding && st.bodyFill,
        bodyContentStyle,
      ]}>
      {children}
    </View>
  );

  const sheetContent = (
    <View
      style={[
        st.sheet,
        {
          backgroundColor: sheetBg,
          paddingBottom: bottomPad,
        },
        sheetSizeStyle,
        sheetStyle,
      ]}>
      <View style={st.dragHandleWrap}>
        <View style={[st.dragHandle, {backgroundColor: handleColor}]} />
      </View>

      <View style={st.header}>
        {showBack && onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={[
              st.headerSide,
              st.headerBtn,
              {
                backgroundColor: headerBtnBg,
                borderColor: headerBtnBorder,
              },
            ]}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <FeatherIcon name="chevron-left" size={20} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={st.headerSide} />
        )}

        {title ? (
          <Text
            style={[st.headerTitle, {color: titleColor}]}
            numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={st.headerTitleSpacer} />
        )}

        <TouchableOpacity
          onPress={onClose}
          style={[
            st.headerSide,
            st.headerBtn,
            {
              backgroundColor: headerBtnBg,
              borderColor: headerBtnBorder,
            },
          ]}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityLabel="Close">
          <FeatherIcon name="x" size={18} color={iconColor} />
        </TouchableOpacity>
      </View>

      {subtitle ? (
        <Text style={[st.subtitle, {color: subtitleColor}]}>{subtitle}</Text>
      ) : null}

      {body}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      onRequestClose={onClose}>
      {usesSplitKeyboardPadding ? (
        <View style={st.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={st.backdropTap} />
          </TouchableWithoutFeedback>
          {sheetContent}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={[
              st.overlay,
              st.overlayBottomAligned,
              overlayPaddingTop != null ? {paddingTop: overlayPaddingTop} : null,
            ]}>
            <TouchableWithoutFeedback>{sheetContent}</TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  );
};

const st = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayBottomAligned: {
    justifyContent: 'flex-end',
  },
  backdropTap: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'column',
    // The sheet shares the screen's background colour, so without a backdrop
    // its own shadow is the only thing separating it from the page behind.
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 24,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  headerSide: {
    width: 36,
    height: 36,
  },
  headerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
  },
  headerTitleSpacer: {
    flex: 1,
  },
  subtitle: {
    ...FONTS.font,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  bodyFill: {
    flex: 1,
    minHeight: 0,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default BottomSheet;
