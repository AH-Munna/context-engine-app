import React from 'react';
import {View, type ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboardInsets} from '../../hooks/useKeyboardInsets';

type Props = ViewProps & {
  children: React.ReactNode;
  /** Pin footer to bottom and lift with keyboard (e.g. overlays). */
  absolute?: boolean;
};

/**
 * Fixed bottom bar (comment input, chat composer) that stays above the keyboard.
 * Owns the bottom safe-area inset, so host screens must leave the `bottom`
 * edge off their SafeAreaView.
 */
const KeyboardSafeFooter = ({children, style, absolute = false, ...rest}: Props) => {
  const insets = useSafeAreaInsets();
  const {footerOffset} = useKeyboardInsets();
  const bottomInset = footerOffset > 0 ? footerOffset : insets.bottom;

  return (
    <View
      style={[
        absolute
          ? {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: bottomInset,
            }
          : {
              paddingBottom: bottomInset,
            },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
};

export default KeyboardSafeFooter;
