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
      background2: '#EBEFF2',
      backgroundColor: COLORS.white,
      card: COLORS.white,
      cardBg: COLORS.white,
      borderColor: COLORS.borderColor,
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
      text: '#F8FAFC',
      textLight: '#94A3B8',
      title: '#FFFFFF',
      background: '#0B0F19',
      background2: '#111827',
      backgroundColor: '#0B0F19',
      card: '#111827',
      cardBg: '#111827',
      borderColor: 'rgba(255, 255, 255, 0.10)',
      border: 'rgba(255, 255, 255, 0.10)',
      themeBg: '#0B0F19',
      primayLight: 'rgba(0, 105, 212, 0.20)',
      bgGradient: ['#0B0F19', '#0B0F19'],
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
