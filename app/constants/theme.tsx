import {Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('screen');

/* ============================================================
   CONTEXT ENGINE — MOBILE DESIGN TOKENS & THEME
   Synchronized with Context Engine design system.
   ============================================================ */

export const COLORS = {
  // Context Engine Brand — Primary Palette
  primary: '#3B5BDB', // Vivid Indigo/Blue (brand primary)
  primaryDark: '#2B44B4', // Deep Indigo
  primaryLight: '#EDF2FF', // Soft Indigo tint
  primayLight: 'rgba(59, 91, 219, 0.08)', // Indigo tint (alias)
  primayLight2: 'rgba(59, 91, 219, 0.14)',
  primayLight3: 'rgba(12, 166, 120, 0.12)',
  primayLight4: 'rgba(245, 158, 11, 0.15)',
  primayLight5: 'rgba(59, 91, 219, 0.20)',

  // Supporting / Legacy Aliases for Component Library compatibility
  primary2: '#0CA678', // Vibrant Teal
  primary3: '#FA5252', // Danger Red
  primary4: '#F59E0B', // Warning Amber
  primary5: '#3B82F6', // Info Blue
  primary6: '#3B5BDB', // Vivid Indigo
  primary7: '#0CA678', // Vibrant Teal

  // Secondary — Vibrant Teal
  secondary: '#0CA678',
  secondaryDark: '#099268',
  secondaryLight: '#E6FCF5',

  // Semantic Feedback Colors
  success: '#10B981', // Emerald Green
  danger: '#EF4444', // Red
  warning: '#F59E0B', // Amber / Orange
  info: '#3B82F6', // Blue
  yellow: '#F59E0B',
  red: '#EF4444',
  coral: '#FA5252',
  teal: '#0CA678',
  brightYellow: '#F59E0B',
  darkTeal: '#1E293B',

  // Surfaces & Neutrals (Light Mode defaults)
  white: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textLight: '#64748B', // Slate 500
  title: '#0F172A', // Slate 900
  dark: '#0F172A',
  light: '#F8FAFC', // Slate 50
  offWhite: '#F8FAFC',
  appBg: '#F8FAFC',
  borderColor: '#E2E8F0', // Slate 200
  darkBorder: 'rgba(255, 255, 255, 0.12)',
  darkBg: '#0B0F19', // Deep dark slate
  placeholderColor: '#94A3B8', // Slate 400
  redLight: 'rgba(239, 68, 68, 0.15)',

  // Theme Helpers
  themePrimary: '#3B5BDB',
  themeSecondary: '#0CA678',
};

export const SIZES = {
  // Typography Sizing
  fontLg: 16,
  font: 14,
  fontSm: 12,
  fontXs: 10,

  // Border Radii
  radius_sm: 8,
  radius: 12,
  radius_md: 20,
  radius_full: 9999,

  // Layout Spacing
  padding: 16,
  margin: 16,

  // Heading Sizes
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,

  // Screen Metrics
  width,
  height,
  container: 800,
};

/** Border style — borderless in dark mode for uniform card/input surfaces */
export function getThemedBorder(
  isDark: boolean,
  colors: {borderColor?: string; border?: string},
) {
  if (isDark) {
    return {
      borderWidth: 1 as const,
      borderColor: 'rgba(255, 255, 255, 0.10)' as const,
    };
  }
  return {
    borderWidth: 1 as const,
    borderColor: colors.borderColor ?? colors.border ?? COLORS.borderColor,
  };
}

/** Subtle row divider */
export function getThemedDivider(isDark: boolean) {
  return isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
}

export const FONTS = {
  fontOutfit: {fontFamily: 'Outfit-SemiBold'},
  fontOutfitMedium: {fontFamily: 'Outfit-Medium'},
  fontInter: {
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
  },
  fontPoppins: {fontFamily: 'Outfit-SemiBold'},
  fontNunito: {
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
  },

  // Body text
  fontLg: {
    fontSize: SIZES.fontLg,
    color: COLORS.text,
    lineHeight: 24,
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
    fontWeight: '700' as const,
  },
  font: {
    fontSize: SIZES.font,
    color: COLORS.text,
    lineHeight: 20,
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
    fontWeight: '400' as const,
  },
  fontSm: {
    fontSize: SIZES.fontSm,
    color: COLORS.textLight,
    lineHeight: 16,
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
  },
  fontXs: {
    fontSize: SIZES.fontXs,
    color: COLORS.textLight,
    lineHeight: 14,
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
  },

  // Headings
  h1: {fontSize: SIZES.h1, color: COLORS.title, fontFamily: 'Outfit-SemiBold'},
  h2: {fontSize: SIZES.h2, color: COLORS.title, fontFamily: 'Outfit-SemiBold'},
  h3: {fontSize: SIZES.h3, color: COLORS.title, fontFamily: 'Outfit-Medium'},
  h4: {fontSize: SIZES.h4, color: COLORS.title, fontFamily: 'Outfit-SemiBold'},
  h5: {fontSize: SIZES.h5, color: COLORS.title, fontFamily: 'Outfit-SemiBold'},
  h6: {fontSize: SIZES.h6, color: COLORS.title, fontFamily: 'Outfit-SemiBold'},

  // Buttons & Controls
  button: {fontSize: 16, fontFamily: 'Outfit-SemiBold', letterSpacing: 0.2},
  buttonSm: {fontSize: 14, fontFamily: 'Outfit-SemiBold', letterSpacing: 0.2},

  // Inputs
  input: {
    fontSize: 15,
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
    fontWeight: '400' as const,
    lineHeight: 20,
    color: COLORS.text,
  },

  fontBold: {
    fontFamily:
      Platform.OS === 'ios' ? 'Inter' : 'Inter-VariableFont_opsz_wght',
    fontWeight: '700' as const,
  },
};

export const ICONS = {
  user: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 12C4.44772 12 4 12.4477 4 13V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V13C20 12.4477 19.5523 12 19 12H5ZM2 13C2 11.3431 3.34315 10 5 10H19C20.6569 10 22 11.3431 22 13V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V13Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11C8 11.5523 7.55228 12 7 12C6.44772 12 6 11.5523 6 11V7C6 5.4087 6.63214 3.88258 7.75736 2.75736C8.88258 1.63214 10.4087 1 12 1C13.5913 1 15.1174 1.63214 16.2426 2.75736C17.3679 3.88258 18 5.4087 18 7V11C18 11.5523 17.5523 12 17 12C16.4477 12 16 11.5523 16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3Z" fill="currentColor"/></svg>`,
  eyeOpen: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.8475 7.43335C23.6331 7.1411 18.5245 0.277466 11.9999 0.277466C5.47529 0.277466 0.366469 7.1411 0.152297 7.43307C-0.0507657 7.71032 -0.0507657 8.08637 0.152297 8.36362C0.366469 8.65587 5.47529 15.5195 11.9999 15.5195C18.5245 15.5195 23.6331 8.65582 23.8475 8.36386C24.0508 8.08665 24.0508 7.71032 23.8475 7.43335Z" fill="#3B5BDB"/></svg>`,
  eyeClose: `<svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.8475 10.4333C23.6331 10.1411 18.5245 3.27747 11.9999 3.27747C5.47529 3.27747 0.366469 10.1411 0.152297 10.4331C-0.0507657 10.7103 -0.0507657 11.0864 0.152297 11.3636C0.366469 11.6559 5.47529 18.5195 11.9999 18.5195C18.5245 18.5195 23.6331 11.6558 23.8475 11.3639C24.0508 11.0866 24.0508 10.7103 23.8475 10.4333Z" fill="#3B5BDB"/></svg>`,
  email: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.88463 9L11.5 2.5L9 -1.13412e-07L1.12188e-06 9L9 18L11.5 15.5L4.88463 9Z" fill="currentColor"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"><path d="M21.44 11.035a.75.75 0 0 1-.69.465H18.5V19a2.25 2.25 0 0 1-2.25 2.25h-3a.75.75 0 0 1-.75-.75V16a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 1-.75.75h-3A2.25 2.25 0 0 1 3.5 19v-7.5H1.25a.75.75 0 0 1-.69-.465.75.75 0 0 1 .158-.818l9.75-9.75A.75.75 0 0 1 11 .246a.75.75 0 0 1 .533.222l9.75 9.75a.75.75 0 0 1 .158.818z" fill="currentColor"/></svg>`,
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.9999 21L16.6499 16.65" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  notification: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C10.218 2 8.509 2.698 7.249 3.941 5.989 5.185 5.281 6.871 5.281 8.629c0 3.031-.657 4.896-1.249 5.966-.297.538-.585.887-.78 1.09-.098.102-.173.168-.216.203-.02.016-.033.026-.037.03-.413.282-.595.795-.449 1.27.148.482.598.812 1.109.812h16.682c.51 0 .961-.33 1.109-.812.146-.475-.036-.988-.449-1.27-.005-.004-.018-.014-.037-.03-.043-.035-.118-.101-.216-.203-.195-.203-.483-.552-.78-1.09-.592-1.07-1.249-2.935-1.249-5.966 0-1.758-.708-3.444-1.968-4.688C15.491 2.698 13.782 2 12 2Z" fill="currentColor"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

export const IMAGES = {
  logo: require('../assets/images/global/logo.png'),
  appLogo: require('../assets/images/global/appLogo.png'),
  appIcon: require('../assets/images/global/appIcon.png'),
  logoWhite: require('../assets/images/global/logo-full-white.png'),
  bgShape: require('../assets/images/global/bg-shape.png'),
  user: require('../assets/images/global/user.png'),
  check: require('../assets/images/global/check.png'),
  bgPattern: require('../assets/images/global/pattern.png'),

  // Icons
  react: require('../assets/images/global/icons/react.png'),
  home3: require('../assets/images/global/icons/home3.png'),
  Image: require('../assets/images/global/icons/Image.png'),
  heart2: require('../assets/images/global/icons/heart2.png'),
  star3: require('../assets/images/global/icons/star3.png'),
  search2: require('../assets/images/global/icons/search2.png'),
  plus: require('../assets/images/global/icons/plus.png'),
  grid: require('../assets/images/global/icons/grid.png'),
  bag: require('../assets/images/global/icons/bag.png'),
  userIco: require('../assets/images/global/icons/user3.png'),
  thumbsUp: require('../assets/images/global/icons/thumbs-up.png'),
  addition: require('../assets/images/global/icons/addition.png'),
  profile3: require('../assets/images/global/icons/user1.png'),
  collage: require('../assets/images/global/icons/collage.png'),
  clock: require('../assets/images/global/icons/clock.png'),
  exchange: require('../assets/images/global/icons/exchange.png'),
  home1: require('../assets/images/global/icons/home1.png'),
  thumb: require('../assets/images/global/icons/thumb.png'),
  love: require('../assets/images/global/icons/love.png'),
  likes: require('../assets/images/global/icons/likes.png'),
  profile1: require('../assets/images/global/profile1.png'),
  network: require('../assets/images/global/icons/network.png'),
  bell: require('../assets/images/global/icons/bell.png'),
  shootcase: require('../assets/images/global/icons/shootcase.png'),
  development: require('../assets/images/global/icons/development.png'),
  design: require('../assets/images/global/icons/design.png'),
  appdeveloper: require('../assets/images/global/icons/appdeveloper.png'),
  promotion: require('../assets/images/global/icons/promotion.png'),
  headphones: require('../assets/images/global/icons/headphones.png'),
  file: require('../assets/images/global/icons/to-do-list.png'),
  logout: require('../assets/images/global/icons/logout.png'),
  language: require('../assets/images/global/icons/language.png'),
  google: require('../assets/images/global/icons/google.png'),
  facebook: require('../assets/images/global/icons/facebook.png'),
  video: require('../assets/images/global/icons/video.png'),
  home: require('../assets/images/global/icons/home.png'),
  home2: require('../assets/images/global/icons/home2.png'),
  search: require('../assets/images/global/icons/search.png'),
  chat: require('../assets/images/global/icons/chat.png'),
  chat2: require('../assets/images/global/icons/chat2.png'),
  profile: require('../assets/images/global/icons/user.png'),
  profile2: require('../assets/images/global/icons/user2.png'),
  Setting: require('../assets/images/global/icons/Setting.png'),
  setting2: require('../assets/images/global/icons/setting2.png'),
  setting3: require('../assets/images/global/icons/setting3.png'),
  Paper: require('../assets/images/global/icons/Paper.png'),
  blog: require('../assets/images/global/icons/blog.png'),
  book: require('../assets/images/global/icons/book.png'),
  like: require('../assets/images/global/icons/like.png'),
  heart: require('../assets/images/global/icons/heart.png'),
  suitcaseIco: require('../assets/images/global/icons/suitcase.png'),
  play: require('../assets/images/global/icons/play.png'),
  list: require('../assets/images/global/icons/list.png'),
  pawprint: require('../assets/images/global/icons/pawprint.png'),
  camera: require('../assets/images/global/icons/photo-camera.png'),
  restaurant: require('../assets/images/global/icons/restaurant.png'),
  system: require('../assets/images/global/icons/system-update.png'),
  star: require('../assets/images/global/icons/star.png'),
  star2: require('../assets/images/global/icons/star2.png'),
  grocery: require('../assets/images/global/icons/supermarket.png'),
  scheme: require('../assets/images/global/icons/scheme.png'),
  fairtrade: require('../assets/images/global/icons/fairtrade.png'),
  reels: require('../assets/images/global/icons/reels.png'),
  subscribes: require('../assets/images/global/icons/subscribes.png'),
  library: require('../assets/images/global/icons/library.png'),
  discount: require('../assets/images/global/icons/discount.png'),
  cash: require('../assets/images/global/icons/cash.png'),
  card: require('../assets/images/global/icons/card.png'),
  pay: require('../assets/images/global/icons/pay.png'),
  wallet: require('../assets/images/global/icons/wallet.png'),
  bank: require('../assets/images/global/icons/bank.png'),
  personal: require('../assets/images/global/icons/personal.png'),
  gift: require('../assets/images/global/icons/gift.png'),
  phonepe: require('../assets/images/global/icons/phonepe.png'),
  photoshop: require('../assets/images/global/icons/photoshop.png'),
  figma: require('../assets/images/global/icons/figma.png'),
  sketch: require('../assets/images/global/icons/sketch.png'),
  colorCircle: require('../assets/images/global/icons/color-circle.png'),
  sparkle: require('../assets/images/global/icons/sparkle.png'),
  fuel: require('../assets/images/global/icons/fuel.png'),
  speedometer: require('../assets/images/global/icons/speedometer.png'),
  gearbox: require('../assets/images/global/icons/gearbox.png'),

  // Flags for Country Phone Input
  UnitedArabEmirates: require('../assets/images/global/flags/UnitedArabEmirates.png'),
  Australia: require('../assets/images/global/flags/Australia.png'),
  india: require('../assets/images/global/flags/india.png'),
  UnitedStates: require('../assets/images/global/flags/UnitedStates.png'),
  german: require('../assets/images/global/flags/german.png'),
  italian: require('../assets/images/global/flags/italian.png'),
  spanish: require('../assets/images/global/flags/spanish.png'),

  // User placeholders (fallback to existing user.png)
  user1: require('../assets/images/global/user.png'),
  user2: require('../assets/images/global/user.png'),
  user3: require('../assets/images/global/user.png'),
  user4: require('../assets/images/global/user.png'),
  user5: require('../assets/images/global/user.png'),
  user6: require('../assets/images/global/user.png'),
  user7: require('../assets/images/global/user.png'),
  user8: require('../assets/images/global/user.png'),

  // Post / Card placeholders (fallback to existing assets)
  post1: require('../assets/images/global/bg-shape.png'),
  post2: require('../assets/images/global/bg-shape.png'),
  post3: require('../assets/images/global/bg-shape.png'),
  post4: require('../assets/images/global/bg-shape.png'),
  post5: require('../assets/images/global/bg-shape.png'),
  post6: require('../assets/images/global/bg-shape.png'),
  post7: require('../assets/images/global/bg-shape.png'),
  post8: require('../assets/images/global/bg-shape.png'),
  post9: require('../assets/images/global/bg-shape.png'),
  post10: require('../assets/images/global/bg-shape.png'),
  post11: require('../assets/images/global/bg-shape.png'),
  post12: require('../assets/images/global/bg-shape.png'),
  post13: require('../assets/images/global/bg-shape.png'),
  post14: require('../assets/images/global/bg-shape.png'),
  post15: require('../assets/images/global/bg-shape.png'),
  post16: require('../assets/images/global/bg-shape.png'),
  post17: require('../assets/images/global/bg-shape.png'),
  post18: require('../assets/images/global/bg-shape.png'),
  post19: require('../assets/images/global/bg-shape.png'),
  post20: require('../assets/images/global/bg-shape.png'),
  post21: require('../assets/images/global/bg-shape.png'),
};

const appTheme = {COLORS, SIZES, FONTS, ICONS, IMAGES};
export default appTheme;
