import { useState, useEffect } from "react";

const ThemeSelector = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.querySelector("html").setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.querySelector("html").setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <label className="swap swap-rotate cursor-pointer">
      {/* Hidden checkbox */}
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />

      {/* Light mode icon (minimal sun) */}
      <svg
        className="swap-on fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
        <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="2" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Dark mode icon (moon) */}
      <svg
        className="swap-off fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64 13.64a9 9 0 01-11.28-11.28 9 9 0 1011.28 11.28z" />
      </svg>
    </label>
  );
};

export default ThemeSelector;
