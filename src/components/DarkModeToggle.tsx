import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Load from localStorage or fall back to system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
    >
      {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
      <span>Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
    </button>
  );
}
