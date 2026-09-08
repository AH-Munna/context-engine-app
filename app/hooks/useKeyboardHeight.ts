import {useKeyboardInsets} from './useKeyboardInsets';

/** @deprecated Prefer useKeyboardInsets for new code. */
export function useKeyboardHeight(enabled = true): number {
  const {keyboardHeight} = useKeyboardInsets(enabled);
  return keyboardHeight;
}
