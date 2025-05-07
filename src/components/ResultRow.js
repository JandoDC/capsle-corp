import React, { useEffect, useRef } from 'react';
import gsap from 'gsap'; // Import GSAP

// Accept guess and answer props (removed lang)
function ResultRow({ guess, answer }) {
  const rowRef = useRef(null); // Ref for GSAP animation

  // GSAP animation effect - Runs when the ResultRow component mounts
  useEffect(() => {
    if (rowRef.current) {
      // Select all the direct children divs which are our cards
      const cards = rowRef.current.children;

      // Set initial state (invisible and slightly lower)
      gsap.set(cards, {
        opacity: 0,
        y: 20
      });

      // Animate to final state (visible at original position)
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out"
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Run only on mount


  if (!guess || !answer || guess.id === "Not found") {
       return null;
  }

  // Define the attributes to display - Now only Gender, Race, Affiliation
  const attributes = [
    { label: "Género", field: "gender", isNumeric: false }, // Updated label
    { label: "Raza", field: "race", isNumeric: false }, // Updated label
    { label: "Afiliación", field: "affiliation", isNumeric: false } // Added Affiliation
    // Removed Deaths, Serie, Saga Debut
  ];

  // Function to get the attribute value - Now relies on the mapped _es fields
  const getAttributeValue = (character, field) => { // Removed currentLang parameter
      if (!character) return null;

      // Directly use the Spanish localized field (e.g., 'gender_es', 'affiliation_es')
      // These fields are created during the data mapping in App.js
      const spanishField = `${field}_es`;
      if (character[spanishField] !== undefined) { // Check if the property exists
          return character[spanishField]; // Return the value from the mapped data
      }

      // Fallback to base field name (e.g., 'deaths') - mainly for numericals if you add them back
      // Or if a field wasn't successfully mapped with _es suffix
       if (character[field] !== undefined) {
           return character[field];
      }

      return 'Desconocido'; // Return Desconocido if value is not found in mapped data
  };

  // Color and Hint logic remains the same, uses getAttributeValue results
  const getColor = (guessVal, correctVal, isNumeric) => {
      // Check for null/undefined and loose equality for correct matches
      if (guessVal != null && correctVal != null && guessVal == correctVal) {
          return "#83DA38"; // Green
      }

      // If values don't match (or if either is null/undefined)
      if (isNumeric) {
          // Orange for incorrect numeric values
          if (guessVal != null && correctVal != null) { // Check both exist to be "incorrect numeric" vs "missing data"
               return "#E9B23C"; // Orange/Yellow
          }
           return "#DA3434"; // Red for missing data in a numeric field
      } else {
          // Red for incorrect categorical values (or missing data)
           return "#DA3434"; // Red
      }
  };

  const getHint = (guessVal, correctVal, isNumeric) => {
    // Hints only for incorrect numeric values
    if (isNumeric && guessVal != correctVal) { // Use != for loose inequality check
      if (typeof guessVal === 'number' && typeof correctVal === 'number') {
           if (guessVal > correctVal) return "down";
           if (guessVal < correctVal) return "up";
      }
    }
    return ""; // No hint
  };

  // Arrow rendering logic remains the same
  const renderArrow = (hint) => {
    if (!hint) return null;
    const arrowSrc = hint === "up" ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg";
    const altText = hint === "up" ? "Higher" : "Lower";
    return (
      <img
        src={arrowSrc}
        alt={altText}
        className="w-5 h-5 mx-auto mb-0.5"
      />
    );
  };

  // Get the display name for the character card (Spanish name or fallback to ID)
  const characterDisplayName = guess.name_es || guess.id; // Use name_es directly from mapped data


  return (
    // Container for a single guess result row.
    // Always a 4-column grid. gap-1 for 4px space. max-w-5xl limits width.
    // items-stretch makes items fill cell height.
    <div ref={rowRef} className="w-full grid grid-cols-4 gap-1 max-w-5xl
                                items-stretch">

      {/* Character Image/Name Card */}
      {/* Spans 1 column, square shape. Border and rounded classes from previous steps. */}
      <div className="flex flex-col w-full border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[8px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[24px] shadow overflow-hidden
                      col-span-1 aspect-square">
         {/* Dark Top Bar for Label - Displays character's name */}
        <div className="bg-gray-800 text-white text-center font-bold text-xs leading-tight py-1 px-1 truncate flex-shrink-0">
          {characterDisplayName.toUpperCase()} {/* Display the character's name (uppercase) */}
        </div>
        {/* Image Content Area */}
        <div className="flex-grow flex items-center justify-center bg-white">
            {/* Display character image if available */}
            {guess.image ? (
              <img
                src={guess.image}
                alt={guess.id}
                className="w-full h-full object-cover p-[2px]" // Padding inside the image
                onError={(e) => {
                     e.target.onerror = null; // Prevent infinite error loops
                     e.target.src = '/icons/placeholder.png'; // Fallback placeholder
                     e.target.classList.add('p-4', 'bg-gray-200', 'object-contain'); // Styles for placeholder icon
                     e.target.classList.remove('object-cover', 'p-[2px]'); // Remove conflicting styles
                     e.target.alt = "Image not available"; // Alt text for placeholder
                 }}
              />
            ) : (
              // Fallback div if no image URL or image fails
               <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center p-2">
                   No Image
               </div>
            )}
        </div>
      </div>

      {/* Map over the 3 attribute cards */}
      {attributes.map((attr) => {
          // Call getAttributeValue using the guess/answer objects and the attribute field
          const guessValue = getAttributeValue(guess, attr.field);
          const correctValue = getAttributeValue(answer, attr.field);
          const bgColor = getColor(guessValue, correctValue, attr.isNumeric); // isNumeric will be false
          // Hint logic is kept, but won't render arrows for current attributes (isNumeric is false)
          const hint = getHint(guessValue, correctValue, attr.isNumeric);

          // Get the display value (string or placeholder)
          const displayValue = (guessValue !== null && guessValue !== undefined) ? String(guessValue) : '—';

          return (
            // Attribute Card Container
            // Spans 1 column, square shape. Border and rounded classes from previous steps.
            <div key={attr.field} className="flex flex-col w-full border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[8px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[24px] shadow overflow-hidden
                                           col-span-1 aspect-square">
              {/* Dark Top Bar for the attribute label (e.g., GÉNERO) */}
              <div className="bg-gray-800 text-white text-center font-bold text-xs leading-tight py-1 px-1 truncate flex-shrink-0">
                {attr.label.toUpperCase()} {/* Display the attribute label in uppercase */}
              </div>
              {/* Content Area with the determined background color */}
              {/* Center content, adjust padding/text size */}
              <div
                className={`flex-grow flex flex-col items-center justify-center text-center px-1 py-1 font-bold text-sm leading-tight ${typeof guessValue === 'string' && guessValue.length > 0 ? 'capitalize' : ''}`} // Capitalize if it's a non-empty string
                style={{ backgroundColor: bgColor, color: '#FFFFFF' }} // Apply background and text color
              >
                {/* Render arrow icon (will not appear for non-numeric attributes) */}
                {renderArrow(hint)}
                {/* Display the attribute's guessed value */}
                <div className="truncate px-0.5 text-sm leading-tight w-full">
                    {displayValue}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ResultRow;
