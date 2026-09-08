import React, {forwardRef, useMemo} from 'react';
import {
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import {useKeyboardInsets} from '../../hooks/useKeyboardInsets';
import {useScrollFieldIntoView} from '../../hooks/useScrollFieldIntoView';

type KeyboardSafeScrollViewProps = ScrollViewProps & {
  extraScrollPadding?: number;
  /** When true, wires scroll-into-view for fields registered via focusField. */
  enableFieldScroll?: boolean;
  footer?: React.ReactNode;
};

export type KeyboardSafeScrollViewRef = ScrollView;

export const KeyboardField = forwardRef<View, ViewProps>(function KeyboardField(
  {children, ...props},
  ref,
) {
  return (
    <View ref={ref} collapsable={false} {...props}>
      {children}
    </View>
  );
});

const KeyboardSafeScrollView = forwardRef<
  ScrollView,
  KeyboardSafeScrollViewProps
>(function KeyboardSafeScrollView(
  {
    contentContainerStyle,
    extraScrollPadding = 24,
    enableFieldScroll = false,
    footer,
    keyboardShouldPersistTaps = 'handled',
    keyboardDismissMode = 'on-drag',
    onScroll,
    scrollEventThrottle = 16,
    style,
    children,
    ...rest
  },
  ref,
) {
  const innerRef = React.useRef<ScrollView>(null);
  const {scrollPaddingBottom} = useKeyboardInsets(true, extraScrollPadding);
  const {onScrollY, focusField} = useScrollFieldIntoView(
    innerRef,
    enableFieldScroll,
  );

  React.useImperativeHandle(ref, () => innerRef.current as ScrollView);

  const mergedContentStyle = useMemo(
    () =>
      StyleSheet.flatten([
        contentContainerStyle,
        {paddingBottom: scrollPaddingBottom},
      ]),
    [contentContainerStyle, scrollPaddingBottom],
  );

  const contextValue = useMemo(
    () => ({focusField: enableFieldScroll ? focusField : undefined}),
    [enableFieldScroll, focusField],
  );

  return (
    <KeyboardScrollContext.Provider value={contextValue}>
      <ScrollView
        ref={innerRef}
        style={[{flex: 1}, style]}
        contentContainerStyle={mergedContentStyle}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        scrollEventThrottle={scrollEventThrottle}
        onScroll={e => {
          onScrollY(e.nativeEvent.contentOffset.y);
          onScroll?.(e);
        }}
        {...rest}>
        {children}
      </ScrollView>
      {footer}
    </KeyboardScrollContext.Provider>
  );
});

type KeyboardScrollContextValue = {
  focusField?: (fieldRef: View | null) => void;
};

export const KeyboardScrollContext =
  React.createContext<KeyboardScrollContextValue>({});

/** Call from TextInput onFocus to scroll the wrapped field into view. */
export function useKeyboardFieldFocus(fieldRef: React.RefObject<View | null>) {
  const {focusField} = React.useContext(KeyboardScrollContext);
  return useMemo(
    () => ({
      onFocus: () => focusField?.(fieldRef.current),
    }),
    [fieldRef, focusField],
  );
}

export default KeyboardSafeScrollView;
