import { useState } from "react";

const DarkModeButton = ({ setIsDark, isDark }) => {
  const handleToggleDarkMode = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="dark-mode">
      {isDark ? (
        <i onClick={() => handleToggleDarkMode()} class="fas fa-sun"></i>
      ) : (
        <i onClick={() => handleToggleDarkMode()} class="fas fa-moon"></i>
      )}
    </div>
  );
};

export default DarkModeButton;
