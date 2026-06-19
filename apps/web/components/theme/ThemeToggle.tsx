import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const icon = theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;
  const label = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

  return (
    <button
      type="button"
      className="btn-ghost hidden sm:inline-flex"
      aria-label={`Theme: ${label}. Click to switch to ${nextTheme}.`}
      title={`Theme: ${label}. Click to switch to ${nextTheme}.`}
      onClick={() => setTheme(nextTheme)}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
};
