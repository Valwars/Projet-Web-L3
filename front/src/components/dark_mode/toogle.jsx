import { useState } from "react";

const DarkModeButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="dark-mode">
      {isDarkMode ? (
        <i onClick={() => handleToggleDarkMode()} class="fas fa-sun"></i>
      ) : (
        <i onClick={() => handleToggleDarkMode()} class="fas fa-moon"></i>
      )}
    </div>
  );
};

export default DarkModeButton;
