import {useCallback, useEffect, useRef} from 'react';
import {
  Platform,
  type ScrollView,
  type View,
} from 'react-native';
import {useKeyboardInsets} from './useKeyboardInsets';

const EXTRA_SPACE = 24;

/**
 * Scrolls a focused field above the keyboard using window measurements.
 * Works with ScrollView — avoids KeyboardAvoidingView layout shrink issues.
 */
export function useScrollFieldIntoView(
  scrollRef: React.RefObject<ScrollView | null>,
  enabled = true,
) {
  const scrollYRef = useRef(0);
  const focusedFieldRef = useRef<View | null>(null);
  const {keyboardHeight, keyboardScreenY, isVisible} = useKeyboardInsets(enabled);

  const scrollFocusedFieldIntoView = useCallback(() => {
    const field = focusedFieldRef.current;
    const scrollView = scrollRef.current;
    if (!field || !scrollView || !isVisible) {
      return;
    }

    field.measureInWindow((_x, y, _w, height) => {
      const inputBottom = y + height;
      const visibleBottom =
        Platform.OS === 'ios'
          ? keyboardScreenY - EXTRA_SPACE
          : keyboardScreenY - EXTRA_SPACE;

      if (inputBottom > visibleBottom) {
        scrollView.scrollTo({
          y: scrollYRef.current + (inputBottom - visibleBottom),
          animated: true,
        });
      }
    });
  }, [isVisible, keyboardScreenY, scrollRef]);

  useEffect(() => {
    if (!isVisible || !focusedFieldRef.current) {
      return;
    }
    const delay = Platform.OS === 'ios' ? 50 : 100;
    const timer = setTimeout(scrollFocusedFieldIntoView, delay);
    return () => clearTimeout(timer);
  }, [isVisible, keyboardHeight, scrollFocusedFieldIntoView]);

  const onScrollY = useCallback((y: number) => {
    scrollYRef.current = y;
  }, []);

  const focusField = useCallback(
    (fieldRef: View | null) => {
      focusedFieldRef.current = fieldRef;
      if (isVisible) {
        setTimeout(scrollFocusedFieldIntoView, Platform.OS === 'ios' ? 50 : 100);
      }
    },
    [isVisible, scrollFocusedFieldIntoView],
  );

  return {keyboardHeight, onScrollY, focusField, scrollPaddingBottom: 0 as number};
}
