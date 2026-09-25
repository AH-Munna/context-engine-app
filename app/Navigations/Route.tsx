import React, {useState, useEffect, useCallback} from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {Appearance} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackNavigator from './StackNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import themeContext from '../constants/themeContext';
import {COLORS} from '../constants/theme';
import {useAppDispatch, useAppSelector} from '../hooks/useRedux';
import {restoreSessionThunk} from '../Redux/slices/appSlice';

export const navigationRef = createNavigationContainerRef();

const THEME_KEY = '@context_engine_theme_preference'; // 'light' | 'dark' | 'system'

const Routes = () => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(state => state.app.isInitialized);

  const [themePref, setThemePref] = useState<'system' | 'light' | 'dark'>('system');
  const [systemScheme, setSystemScheme] = useState(
    Appearance.getColorScheme() || 'light',
  );
  const [themeReady, setThemeReady] = useState(false);

  // Restore authentication session & tokens on startup
  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  // Load persisted theme preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then(val => {
        if (val === 'light' || val === 'dark' || val === 'system') {
          setThemePref(val);
        }
        setThemeReady(true);
      })
      .catch(() => setThemeReady(true));
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({colorScheme}) => {
      setSystemScheme(colorScheme || 'light');
    });
    return () => sub.remove();
  }, []);

  const isDarkTheme =
    themePref === 'system' ? systemScheme === 'dark' : themePref === 'dark';

  const persistTheme = useCallback(async (val: 'system' | 'light' | 'dark') => {
    setThemePref(val);
    try {
      await AsyncStorage.setItem(THEME_KEY, val);
    } catch {}
  }, []);

  const authContext = React.useMemo(
    () => ({
      themePref,
      setDarkTheme: () => persistTheme('dark'),
      setLightTheme: () => persistTheme('light'),
      setSystemTheme: () => persistTheme('system'),
    }),
    [themePref, persistTheme],
  );

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: COLORS.primary,
      text: COLORS.text,
      textLight: COLORS.textLight,
      title: COLORS.title,
      background: COLORS.light,
      background2: COLORS.surface,
      backgroundColor: COLORS.white,
      surface: COLORS.surface,
      card: COLORS.white,
      cardBg: COLORS.white,
      borderColor: COLORS.borderColor,
      border: COLORS.borderColor,
      themeBg: COLORS.white,
      primayLight: COLORS.primayLight,
      bgGradient: [COLORS.white, COLORS.white],
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: COLORS.primary,
      text: COLORS.darkText,
      textLight: COLORS.darkMuted,
      title: COLORS.darkText,
      background: COLORS.darkBg,
      background2: COLORS.darkSurface,
      backgroundColor: COLORS.darkBg,
      surface: COLORS.darkSurface,
      card: COLORS.darkCard,
      cardBg: COLORS.darkCard,
      borderColor: COLORS.darkBorder,
      border: COLORS.darkBorder,
      themeBg: COLORS.darkBg,
      primayLight: COLORS.primayLight5,
      bgGradient: [COLORS.darkBg, COLORS.darkBg],
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  if (!themeReady || !isInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <themeContext.Provider value={authContext}>
        <NavigationContainer ref={navigationRef} theme={theme}>
          <StackNavigator />
        </NavigationContainer>
      </themeContext.Provider>
    </SafeAreaProvider>
  );
};

export default Routes;
