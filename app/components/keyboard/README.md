# Keyboard handling patterns

Context Engine centralizes keyboard layout in `useKeyboardInsets` and the components under `app/components/keyboard/`.

## When to use what

### `KeyboardSafeScrollView`

Use on **full-screen forms and pages** with one or more text fields.

- Set `keyboardShouldPersistTaps="handled"` so taps on buttons and pickers work while the keyboard is open.
- For multi-field screens, enable **`enableFieldScroll`** and wrap each focusable field in **`KeyboardField`** with `useKeyboardFieldFocus`.

### `KeyboardSafeFooter`

Use when a **fixed footer** (primary action bar) must sit above the keyboard on iOS.

- The footer owns the bottom safe-area inset: leave `bottom` out of the host screen's `SafeAreaView` edges or the footer floats above the navigation bar.
- Edge-to-edge windows (enforced from Android 15) are not resized by `adjustResize`, so `useKeyboardInsets` lifts the footer by the keyboard height plus the bottom inset there. Legacy Android windows still resize and get no offset.

### `KeyboardBottomSheet`

Use for **modals / bottom sheets that contain `TextInput`** (search, forms, country picker).

- Wraps `BottomSheet` + `useKeyboardInsets` + `getKeyboardModalLayout()`.

### Stepped pickers in profile edit

`UserProfile` uses one `KeyboardBottomSheet` with internal steps (`form` → `city` / `country` / `interest`) instead of stacking modals. Reuse `CityPickerContent`, `CountryPickerContent`, and `PickerFieldRow` for the same pattern elsewhere.

### Plain `BottomSheet`

Use for pickers and menus **without** text inputs (date range, action menus, confirms).

## Field scroll checklist

Production forms with `enableFieldScroll`:

| Screen | Notes |
|--------|-------|
| Edit Profile | Bio, WhatsApp, Instagram |
| Add Plan | Optional description |
| Create Account | Name, email |
| Forgot Password | Phone via `CountryPhoneInput` sheet |
| Add Recommendation | Address, highlight, details |
| Sign In / Enter Code / Change Password | Already configured |

## Map & overlay search

- **Maps**: dismiss keyboard on map pan/press; bottom panel gets `footerOffset` when keyboard is open; top search dropdown height is clamped to keyboard top.
- **My Trips**: filter city input uses `KeyboardSafeScrollView` + extra bottom padding while keyboard is visible.

## Permission prompts

Pure utils (`locationPermission`, `contactsPermission`, `photoLibraryPermission`) **do not** show UI.

Callers render `ConfirmBottomSheet` using configs from `app/utils/permissionPrompts.ts` when permission is blocked.

## QA matrix (manual)

Test on **iOS and Android**, light and dark mode:

| Area | Checks |
|------|--------|
| All bottom sheets | X closes, tap-outside closes, Android back dismisses |
| Sheets with inputs | Focused field stays visible above keyboard |
| Destructive actions | Confirm sheet before delete/logout/unfriend |
| Nested pickers | City/country autocomplete inside edit sheet stacks correctly |
| Map search | Keyboard dismisses on map pan; panel search not covered |
| Form screens | Bottom fields scroll into view when focused |

## Deprecated

- `useKeyboardHeight` — shim only; use `useKeyboardInsets` in new code.
- `KeyboardAvoidingView` — removed project-wide; do not reintroduce.
