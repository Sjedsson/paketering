import React, { useState } from 'react';

function ThemeSwitcher() {
  const [theme, setTheme] = useState('light'); // State för temat

  // Växlar mellan dark och light tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`ThemeSwitcher ${theme}`}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Byt till Dark Mode' : 'Byt till Light Mode'}
      </button>
    </div>
  );
}

export default ThemeSwitcher;
