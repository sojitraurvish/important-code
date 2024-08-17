"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useLayoutEffect } from 'react';

type ThemeContextType = {
  theme: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const storedTheme = sessionStorage.getItem('theme');
      if (storedTheme !== null) {
        return storedTheme === 'true';
      } else {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    return false; // Default theme if window is not defined
  };

  const [theme, setTheme] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    if (theme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    sessionStorage.setItem('theme', theme.toString());

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => setTheme((prevTheme) => !prevTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
















// import { useEffect, useState } from "react";

export function useNewWindowScroll(threshold = 10 /* value in px */) {
  const [isBelowThreshold, setIsBelowThreshold] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > threshold) {
      setIsBelowThreshold(true);
    } else {
      setIsBelowThreshold(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isBelowThreshold;
}



----------------------------------------------
_app
import store from '@/store/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
// lang Support Page
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '@/hooks/useTheme';

const poppins = Poppins({
  preload:true,
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <div>
          <main className={`${poppins.className} dark:bg-bg-primary-dark`}>
            <Toaster expand={false} position="bottom-right" richColors />
            
            <Component {...pageProps} />
          </main>
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);