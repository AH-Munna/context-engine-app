import {useEffect, useMemo, useState} from 'react';
import {Dimensions, Keyboard, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type KeyboardInsets = {
  /** Raw keyboard height from the OS event. */
  keyboardHeight: number;
  /** Y coordinate of the top edge of the keyboard (screen space). */
  keyboardScreenY: number;
  isVisible: boolean;
  /** Lift fixed footers on iOS; Android uses adjustResize. */
  footerOffset: number;
  /** Extra bottom padding for scroll content. */
  scrollPaddingBottom: number;
};

/**
 * Single source of truth for keyboard layout.
 * iOS: window does not shrink — apply insets manually.
 * Android (adjustResize): window shrinks — avoid double-padding footers.
 */
export function useKeyboardInsets(
  enabled = true,
  extraScrollPadding = 24,
): KeyboardInsets {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardScreenY, setKeyboardScreenY] = useState(
    Dimensions.get('window').height,
  );

  useEffect(() => {
    if (!enabled) {
      setKeyboardHeight(0);
      setKeyboardScreenY(Dimensions.get('window').height);
      return;
    }

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardScreenY(e.endCoordinates.screenY);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setKeyboardScreenY(Dimensions.get('window').height);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled]);

  return useMemo(() => {
    const isVisible = keyboardHeight > 0;

    // Edge-to-edge windows (enforced from Android 15) are never resized for
    // the keyboard: the same switch that stops the system bars from being
    // consumed also disables adjustResize, so footers must lift themselves.
    // Legacy windows are resized by the system and would double-lift.
    const window = Dimensions.get('window');
    const screen = Dimensions.get('screen');
    const isOverlaidByKeyboard =
      Platform.OS === 'android' &&
      window.height >= screen.height &&
      insets.bottom > 0;

    // Android reports the keyboard height without the navigation bar the
    // keyboard covers, so the bottom inset is added back to reach its top.
    const footerOffset = !isVisible
      ? 0
      : Platform.OS === 'ios'
        ? keyboardHeight
        : isOverlaidByKeyboard
          ? keyboardHeight + insets.bottom
          : 0;
    const scrollPaddingBottom =
      (isVisible ? footerOffset : insets.bottom) + extraScrollPadding;

    return {
      keyboardHeight,
      keyboardScreenY,
      isVisible,
      footerOffset,
      scrollPaddingBottom,
    };
  }, [
    extraScrollPadding,
    insets.bottom,
    keyboardHeight,
    keyboardScreenY,
  ]);
}
