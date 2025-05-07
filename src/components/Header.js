import React from 'react'; // No useState needed anymore

// Accept no props (removed lang, setLang)
function Header() {
    // Removed language list and selection logic

    return (
      // Header container: Full width, flex column, centered items
      <div className="w-full flex flex-col items-center px-6 py-4">
        {/* Logo - Centered */}
        {/* Ensure public/capsle-logo.png exists */}
        <img src="/capsle-logo.png" alt="Capsle Corp Logo" className="w-16 sm:w-20 mx-auto" />

        {/* Settings Icon (Placeholder/Button) - Keep this */}
        {/* This button doesn't do anything yet */}
        <div className="flex items-center justify-center gap-4 mt-4"> {/* Container for settings if needed */}
            <button className="p-1 rounded-full hover:bg-gray-200 focus:outline-none">
                 {/* SVG for Settings icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.178.108.385.199.602.281m-3.147 8.382a3 3 0 100-6 3 3 0 000 6z" />
                 </svg>
            </button>

            {/* Language Selector Div - Removed */}
            {/* If you removed the language selector, you might not need this wrapper div */}
            {/* If keeping settings icon, this div might stay as a flexible container */}
        </div>
      </div>
    );
  }

  export default Header;
