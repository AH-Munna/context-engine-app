import {createContext} from 'react';

export interface ThemeContextType {
  themePref: 'system' | 'light' | 'dark';
  setDarkTheme: () => void;
  setLightTheme: () => void;
  setSystemTheme: () => void;
}

const themeContext = createContext<ThemeContextType>({
  themePref: 'system',
  setDarkTheme: () => {},
  setLightTheme: () => {},
  setSystemTheme: () => {},
});

export default themeContext;
