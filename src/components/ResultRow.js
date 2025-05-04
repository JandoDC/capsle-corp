import React from 'react';

// Ensure you have these icon files in your public/icons folder
// public/icons/arrow-up.svg
// public/icons/arrow-down.svg
// Optional: public/icons/placeholder.png for missing images

function ResultRow({ guess, answer, lang }) {
  // Do not render anything if guess or answer data is missing
  if (!guess || !answer || guess.id === "Not found") {
       // console.warn("ResultRow received invalid data:", { guess, answer }); // Optional: Log warning during development
       return null; // Don't render the row if data is incomplete
  }

  // Define the attributes to display, their labels, field names, and type (numeric?)
  // Add or remove attributes here as needed to match your data and desired display
  const attributes = [
    // { label: "Character", field: "character", isNumeric: false }, // Handled separately as the image box
    { label: "Gender", field: "gender", isNumeric: false },
    { label: "Race", field: "race", isNumeric: false },
    { label: "Origin", field: "origin", isNumeric: false },
    { label: "Deaths", field: "deaths", isNumeric: true }, // Mark as numeric
    { label: "Serie", field: "serie", isNumeric: false },
    { label: "Saga Debut", field: "saga", isNumeric: false }
    // Example of adding another attribute:
    // { label: "Affiliation", field: "affiliation", isNumeric: false },
    // { label: "Power Level", field: "powerLevel", isNumeric: true }, // Assuming powerLevel is a number
  ];

  // Function to get the attribute value from a character object, prioritizing localization
  const getAttributeValue = (character, field, currentLang) => {
      if (!character) return null; // Return null if character object is null/undefined

      // 1. Try localized field (e.g., 'gender_en', 'race_es')
      const localizedField = `${field}_${currentLang}`;
      if (character[localizedField] !== undefined) { // Check if the property exists
          return character[localizedField]; // Return the value, even if it's null or undefined
      }

      // 2. Fallback to the base field name (e.g., 'deaths', 'gender')
      // This is important for numerical values or fields that aren't localized
      if (character[field] !== undefined) { // Check if the base property exists
           return character[field]; // Return the base value
      }

      // 3. If neither exists, return null
      return null;
  };


  // Function to determine the background color of the attribute box
  const getColor = (guessVal, correctVal, isNumeric) => {
      // If the guessed value matches the correct value, it's always green
      // Use loose equality (==) or toString().toLowerCase() for flexible comparison if types might differ
      // Ensure both values are not null/undefined before comparing for equality
      if (guessVal !== null && guessVal !== undefined && correctVal !== null && correctVal !== undefined && guessVal == correctVal) {
          return "#83DA38"; // Green (Correct Match)
      }

      // If values don't match
      if (isNumeric) {
          // For incorrect numeric values, use orange/yellow as shown in the image
          // This color indicates it's a number but not the correct one
          if (guessVal !== null && guessVal !== undefined && correctVal !== null && correctVal !== undefined) {
               return "#E9B23C"; // Orange/Yellow (Incorrect Numeric)
          }
           // If data is missing for a numeric field, use red
           return "#DA3434"; // Red (Missing Data or other error condition)
      } else {
          // For incorrect categorical values (strings), use red
           // Ensure both values are not null/undefined before determining incorrectness
          if (guessVal !== null && guessVal !== undefined && correctVal !== null && correctVal !== undefined) {
              return "#DA3434"; // Red (Incorrect Categorical)
          }
           // If data is missing for a categorical field, use red
          return "#DA3434"; // Red (Missing Data) - You could change this to a gray if preferred
      }
  };


  // Function to determine if an arrow hint is needed for numeric values
  const getHint = (guessVal, correctVal, isNumeric) => {
    // Hints are only given for numeric attributes that are *incorrect*
    if (isNumeric && guessVal !== correctVal) {
      // Ensure both values are valid numbers before comparing
      if (typeof guessVal === 'number' && typeof correctVal === 'number') {
           if (guessVal > correctVal) return "down"; // Guessed value is higher, target is lower
           if (guessVal < correctVal) return "up";   // Guessed value is lower, target is higher
      }
       // If data is missing or not numeric when expected, no arrow hint
    }
    return ""; // No hint needed (correct match, non-numeric, or missing/invalid data)
  };

  // Function to render the appropriate arrow icon based on the hint
  const renderArrow = (hint) => {
    if (!hint) return null; // Don't render an arrow if there's no hint ('up' or 'down')

    const arrowSrc = hint === "up" ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg";
    const altText = hint === "up" ? "Higher" : "Lower";

    return (
       // Render the arrow icon centered horizontally above the value
      <img
        src={arrowSrc}
        alt={altText}
        className="w-5 h-5 mx-auto" // w-5/h-5 for size, mx-auto centers it
        // Removed mb-1 to give more vertical space for the value
      />
    );
  };


  // --- Render the Result Row ---
  return (
    // Container for a single guess result row.
    // Uses flexbox that wraps items on small screens, and remains a single row on larger screens if space allows.
    // gap-2 adds space between items. items-start aligns items to the top of their row.
    // Removed grid classes to allow flexbox to manage 80px fixed items in a row.
    <div className="w-full flex flex-wrap justify-center gap-2 max-w-5xl items-start">

      {/* --- Character Image/Name Card (Special Case) --- */}
      {/* This card has the dark top bar for "CHARACTER" and displays the image. */}
      {/* Apply the requested FIXED width and height (80x80px) */}
      <div className="flex flex-col w-[80px] h-[80px] border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[0px] rounded-tr-[0px] rounded-br-[8px] rounded-bl-[2px] shadow overflow-hidden flex-shrink-0"> {/* Added flex-shrink-0 to prevent shrinking */}
         {/* Dark Top Bar for Label */}
         {/* Adjusted py and text size to fit "CHARACTER" label in smaller height */}
        <div className="bg-gray-800 text-white text-center font-bold text-[10px] leading-tight py-0.5 px-0.5 truncate flex-shrink-0"> {/* Smaller text, tighter leading/padding */}
          CHARACTER {/* Static label for the character card */}
        </div>
        {/* Image Content Area */}
        {/* Use flex-grow to take up remaining vertical space. Centered content */}
        <div className="flex-grow flex items-center justify-center bg-white p-[1px]"> {/* Minimal padding */}
            {/* Display character image if available */}
            {guess.image ? (
              <img
                src={guess.image}
                alt={guess.id} // Use character ID as alt text
                 // Ensure the image covers the area while maintaining aspect ratio
                className="w-full h-full object-cover"
                onError={(e) => {
                     // If image fails to load, display a placeholder
                     // Ensure public/icons/placeholder.png exists or use a simple div fallback
                     e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                     e.target.src = '/icons/placeholder.png'; // Path to your placeholder icon/image
                     e.target.classList.add('p-2', 'bg-gray-200', 'object-contain'); // Add padding/bg, use contain for icon
                     e.target.classList.remove('object-cover'); // Remove object-cover
                     e.target.alt = "Image not available"; // Update alt text for placeholder
                 }}
              />
            ) : (
              // Display a fallback div if no image URL is provided or image fails
               <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center p-1">
                   No Image
               </div>
            )}
        </div>
         {/* Removed optional character ID display below image to save vertical space */}
      </div>

      {/* --- Map over other attributes to create cards --- */}
      {attributes.map((attr) => {
          // Get the guessed value and the correct answer value for the current attribute
          const guessValue = getAttributeValue(guess, attr.field, lang);
          const correctValue = getAttributeValue(answer, attr.field, lang); // Compare against the correct answer

          // Determine the background color based on the values and attribute type
          const bgColor = getColor(guessValue, correctValue, attr.isNumeric);

          // Determine if an arrow hint is needed for numeric attributes
          const hint = getHint(guessValue, correctValue, attr.isNumeric);

          // Get the display value for the attribute (the guessed value)
          // If the value is null or undefined, display a placeholder character like '—'
          const displayValue = (guessValue !== null && guessValue !== undefined) ? guessValue : '—';


          return (
            // Container for a single attribute card
            // Apply the requested FIXED width and height (80x80px).
            <div key={attr.field} className="flex flex-col w-[80px] h-[80px] border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[0px] rounded-tr-[0px] rounded-br-[8px] rounded-bl-[2px] shadow overflow-hidden flex-shrink-0"> {/* Added flex-shrink-0 */}
              {/* Dark Top Bar for the attribute label */}
              {/* Adjusted py and text size to fit label */}
              <div className="bg-gray-800 text-white text-center font-bold text-[10px] leading-tight py-0.5 px-0.5 truncate flex-shrink-0"> {/* Smaller text, tighter leading/padding */}
                {attr.label.toUpperCase()} {/* Display the attribute label in uppercase */}
              </div>
              {/* Content Area of the card with the determined background color */}
              {/* Use flex-grow to take up remaining vertical space. Centered content. */}
              {/* Set text color to white. Adjusted padding and text size for fit */}
              <div
                className={`flex-grow flex flex-col items-center justify-center text-center px-0.5 py-0.5 font-bold text-sm leading-tight`} // Reduced padding, adjusted text size
                style={{ backgroundColor: bgColor, color: '#FFFFFF' }} // Apply background and text color
              >
                {/* Render arrow icon (if hint exists) */}
                {/* Rendered before the value */}
                {renderArrow(hint)}

                {/* Display the attribute's guessed value */}
                {/* Use a span or div with truncate if values can be long */}
                {/* Adjusted text size to try and fit value */}
                <div className="truncate px-0.5 text-sm leading-tight"> {/* Adjusted padding and text size */}
                    {displayValue} {/* Display the formatted or placeholder value */}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ResultRow;
