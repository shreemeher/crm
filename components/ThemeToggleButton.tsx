import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunDim, MoonStar } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleButtonProps {
  className?: string;  
}

export default function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isToggling, setIsToggling] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Mark that the component is hydrated
  }, []);

  const toggleTheme = () => {
    setIsToggling(true);
    setTheme(theme === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsToggling(false), 80);
  };

  if (!mounted) return null; // Avoid rendering until hydration is complete

  return (
    <Button
      onClick={toggleTheme}
      className={className}
      variant="ghost"
    >
      {resolvedTheme === 'dark' ? (
        <SunDim
          className={`h-[1.5rem] w-[1.5rem] transition-all duration-300 ${
            isToggling
              ? "rotate-180 scale-50 opacity-50"
              : "rotate-10 scale-100 opacity-100"
          }`}
        />
      ) : (
        <MoonStar
          className={`h-[1.5rem] w-[1.5rem] transition-all duration-300 ${
            isToggling
              ? "rotate-180 scale-50 opacity-50"
              : "rotate-10 scale-100 opacity-100"
          }`}
        />
      )}
    </Button>
  );
}
