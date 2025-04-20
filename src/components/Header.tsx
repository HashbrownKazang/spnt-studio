import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { UserButton } from '@clerk/nextjs';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }: HeaderProps) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  return (
    <header className="bg-background text-foreground py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold">{title}</div>
      <div className="flex items-center space-x-4">
        <Toggle
          checked={theme === 'dark'}
          onChange={() => toggleTheme()}
          icons={{
            checked: <FaMoon />,
            unchecked: <FaSun />,
          }}
        />
        <div className="rounded-full bg-muted text-foreground w-10 h-10 flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;