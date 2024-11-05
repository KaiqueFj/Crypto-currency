import { iconMoon, iconSun } from './handleElements';

export function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');

  // Toggle icon visibility based on theme
  iconSun.classList.toggle('hidden', theme === 'dark');
  iconMoon.classList.toggle('hidden', theme === 'light');

  localStorage.setItem('theme', theme);
}

// Initial theme setting from localStorage or default
const storedTheme = localStorage.getItem('theme') || 'light';
setTheme(storedTheme);
