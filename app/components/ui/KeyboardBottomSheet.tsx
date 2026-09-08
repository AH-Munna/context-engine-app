import React, {useMemo} from 'react';
import {Dimensions, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboardInsets} from '../../hooks/useKeyboardInsets';
import {getKeyboardModalLayout} from '../../utils/keyboardModal';
import BottomSheet, {type BottomSheetProps} from './BottomSheet';

/** Leaves a strip of backdrop visible above the sheet. */
const SHEET_HEIGHT_RATIO = '92%' as const;
/** Android: same strip as a fixed height, so the sheet's top edge stays put
 * when the Modal window shrinks for the keyboard. */
const ANDROID_TOP_GAP = 56;
/** Android Modal windows already sit inside the system bars, so the bottom
 * inset must not be added again. */
const ANDROID_BOTTOM_PAD = 16;

export type KeyboardBottomSheetProps = Omit<
  BottomSheetProps,
  'overlayPaddingBottom' | 'maxHeight'
> & {
  /** Fixed chrome height above scrollable list/content (header + search etc.). */
  chromeHeight?: number;
  minContentHeight?: number;
  /** Fill the available height (search lists). Off for short content. */
  fillHeight?: boolean;
};

const KeyboardBottomSheet = ({
  visible,
  chromeHeight = 120,
  minContentHeight = 100,
  fillHeight = true,
  ...rest
}: KeyboardBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const {keyboardHeight, keyboardScreenY} = useKeyboardInsets(visible);
  const windowHeight = Dimensions.get('window').height;

  // Android (adjustResize) already shrinks the Modal window for the keyboard
  // and the system bars, so subtracting them again over-sizes the sheet.
  const isAndroid = Platform.OS === 'android';
  const effectiveKeyboardHeight = isAndroid ? 0 : keyboardHeight;

  const layout = useMemo(
    () =>
      getKeyboardModalLayout({
        keyboardHeight: effectiveKeyboardHeight,
        keyboardScreenY,
        windowHeight,
        insetTop: insets.top,
        insetBottom: insets.bottom,
        chromeHeight,
        minListHeight: minContentHeight,
      }),
    [
      chromeHeight,
      effectiveKeyboardHeight,
      insets.bottom,
      insets.top,
      keyboardScreenY,
      minContentHeight,
      windowHeight,
    ],
  );

  if (isAndroid) {
    return (
      <BottomSheet
        {...rest}
        visible={visible}
        overlayPaddingBottom={ANDROID_BOTTOM_PAD}
        overlayPaddingTop={ANDROID_TOP_GAP}
        // Mirrors the iOS branch below: only stretch to full height for
        // fillHeight sheets (search/list pickers). Short, single-field
        // sheets (fillHeight=false) must size to their content, capped at
        // SHEET_HEIGHT_RATIO — otherwise BottomSheet's sizing logic sees
        // maxHeight === '100%' and forces `height: '100%'` regardless of
        // how little content there is (e.g. a single TextInput).
        maxHeight={fillHeight ? '100%' : SHEET_HEIGHT_RATIO}
        sheetStyle={
          fillHeight
            ? [{height: '100%' as const}, rest.sheetStyle]
            : rest.sheetStyle
        }
      />
    );
  }

  const iosOverlayBottom = layout.overlayPaddingBottom;
  const iosSheetBottomPad =
    keyboardHeight > 0 ? 12 : Math.max(insets.bottom, 16);

  return (
    <BottomSheet
      {...rest}
      visible={visible}
      overlayPaddingBottom={iosOverlayBottom}
      overlayPaddingTop={layout.overlayPaddingTop}
      sheetPaddingBottom={iosSheetBottomPad}
      maxHeight={fillHeight ? '100%' : SHEET_HEIGHT_RATIO}
    />
  );
};

export default KeyboardBottomSheet;
