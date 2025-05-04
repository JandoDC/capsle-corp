import React, { useState } from 'react'; // Import useState for potential future dropdown logic

function Header({ lang, setLang }) {
    // List of supported languages with flag emojis and labels
    const languages = [
      { code: "en", label: "🇺🇸 EN", flag: "🇺🇸" },
      { code: "es", label: "🇪🇸 ES", flag: "🇪🇸" },
      { code: "de", label: "🇩🇪 DE", flag: "🇩🇪" },
      { code: "fr", label: "🇫🇷 FR", flag: "🇫🇷" },
      { code: "pt", label: "🇵🇹 PT", flag: "🇵🇹" },
      { code: "it", label: "🇮🇹 IT", flag: "🇮🇹" },
      { code: "ja", label: "🇯🇵 JA", flag: "🇯🇵" },
      { code: "zh", label: "🇨🇳 ZH", flag: "🇨🇳" },
    ];

    // Find the currently selected language object
    const selectedLang = languages.find(l => l.code === lang) || languages[0];

    // State for controlling the language dropdown visibility (optional, if implementing custom dropdown)
    // const [showLangDropdown, setShowLangDropdown] = useState(false);

    return (
      // Header container: Full width, flex column on small screens, center aligns items
      <div className="w-full flex flex-col items-center px-6 py-4">
        {/* Logo: Centered horizontally */}
        {/* Ensure you have capsle-logo.png in your public folder */}
        <img src="/capsle-logo.png" alt="Capsle Corp Logo" className="w-16 sm:w-20 mx-auto" />

        {/* Settings and Language Selector Row: Below the logo, flex row, centered */}
        <div className="flex items-center justify-center gap-4 mt-4"> {/* Added justify-center */}

            {/* Settings Icon Button (Placeholder) */}
            {/* This button doesn't do anything yet, you can add an onClick handler */}
            <button className="p-1 rounded-full hover:bg-gray-200 focus:outline-none">
                 {/* SVG for Settings icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.178.108.385.199.602.281m-3.147 8.382a3 3 0 100-6 3 3 0 000 6z" />
                 </svg>
            </button>

            {/* Language Selector */}
            {/* This div acts as the visual trigger (flag + arrow) */}
             <div className="relative flex items-center gap-1 cursor-pointer border border-black rounded-full px-3 py-1 shadow">
                {/* Display current flag emoji */}
                <span className="text-lg">{selectedLang.flag}</span>
                 {/* Arrow icon indicating it's a dropdown */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                {/* Hidden <select> element positioned over the div */}
                {/* This provides basic language switching functionality */}
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer" // Make it cover the div but be invisible
                    aria-label="Select language" // Accessibility label
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                {/*
                Alternative: Custom Dropdown Implementation
                - Remove the hidden <select> above.
                - Add an onClick={() => setShowLangDropdown(!showLangDropdown)} to the parent div.
                - Conditionally render a <ul> or <div> containing language options below this div based on showLangDropdown state.
                - Position the dropdown list using absolute positioning.
                - Implement logic to close the dropdown on item click or outside click.
                This gives more styling control but is more complex.
                */}
             </div>
        </div>
      </div>
    );
  }

  export default Header;
