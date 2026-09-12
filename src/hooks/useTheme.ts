import { useState, useEffect } from 'react';
import { playClickSound } from '../utils/audioFx';

export type ThemeMode = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('workstation_theme') as ThemeMode;
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch {
      // Ignore sandboxed localStorage errors
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const activeTheme: 'dark' | 'light' =
    theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    try {
      localStorage.setItem('workstation_theme', theme);
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    if (activeTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    }
  }, [theme, activeTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    playClickSound();
    setThemeState(newTheme);
  };

  const cycleTheme = () => {
    playClickSound();
    setThemeState((prev) => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  return {
    theme,
    setTheme,
    cycleTheme,
    activeTheme,
    isLight: activeTheme === 'light',
  };
}
