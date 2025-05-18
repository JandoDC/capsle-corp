import React from 'react'; // No useState needed anymore

// Accept no props (removed lang, setLang)
function Header() {
    // Removed language list and selection logic

    return (
      // Header container: Full width, flex column, centered items
      <div className="w-full flex flex-col items-center px-6 py-4">
        {/* Logo - Centered */}
        {/* Ensure public/capsle-logo.png exists */}
        <img src="/capsle-logo.svg" alt="Capsle Corp Logo" className="w-40  mx-auto" />

        {/* Settings Icon (Placeholder/Button) - Keep this */}
        {/* This button doesn't do anything yet */}
      </div>
    );
  }

  export default Header;
