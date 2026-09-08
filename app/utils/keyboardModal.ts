import {Dimensions} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/** Layout metrics for a bottom-sheet modal above the keyboard. */
export function getKeyboardModalLayout(options: {
  keyboardHeight: number;
  /** iOS: top edge of keyboard in window coordinates. */
  keyboardScreenY?: number;
  windowHeight?: number;
  insetTop: number;
  insetBottom: number;
  chromeHeight: number;
  minListHeight?: number;
}) {
  const {
    keyboardHeight,
    keyboardScreenY,
    windowHeight = SCREEN_HEIGHT,
    insetTop,
    insetBottom,
    chromeHeight,
    minListHeight = 100,
  } = options;

  const overlayPaddingTop = Math.max(insetTop, 8);
  const overlayPaddingBottom =
    keyboardHeight > 0
      ? keyboardScreenY != null
        ? Math.max(0, windowHeight - keyboardScreenY)
        : keyboardHeight
      : Math.max(insetBottom, 16);

  const modalHeight = Math.max(
    chromeHeight + minListHeight,
    windowHeight - overlayPaddingTop - overlayPaddingBottom,
  );

  const listMaxHeight = Math.max(minListHeight, modalHeight - chromeHeight);

  return {
    overlayPaddingTop,
    overlayPaddingBottom,
    /** @deprecated use modalHeight */
    modalMaxHeight: modalHeight,
    modalHeight,
    listMaxHeight,
  };
}
