import React from 'react';

function ResultRow({ guess, answer, lang }) {
  if (!guess || !answer || guess.id === "Not found") {
       return null;
  }

  const attributes = [
    { label: "Gender", field: "gender", isNumeric: false },
    { label: "Race", field: "race", isNumeric: false },
    { label: "Origin", field: "origin", isNumeric: false },
    { label: "Deaths", field: "deaths", isNumeric: true },
    { label: "Serie", field: "serie", isNumeric: false },
    { label: "Saga Debut", field: "saga", isNumeric: false }
  ];

  const getAttributeValue = (character, field, currentLang) => {
      if (!character) return null;
      const localizedField = `${field}_${currentLang}`;
      if (character[localizedField] !== undefined) {
          return character[localizedField];
      }
      if (character[field] !== undefined) {
           return character[field];
      }
      return null;
  };

  const getColor = (guessVal, correctVal, isNumeric) => {
      if (guessVal !== null && guessVal !== undefined && correctVal !== null && correctVal !== undefined && guessVal == correctVal) {
          return "#83DA38";
      }
      if (isNumeric) {
          if (guessVal !== null && guessVal !== undefined && correctVal !== null && correctVal !== undefined) {
               return "#E9B23C";
          }
           return "#DA3434";
      } else {
          if (guessVal !== null && guessVal !== undefined && correctVal !== null && correctVal !== undefined) {
              return "#DA3434";
          }
           return "#DA3434";
      }
  };

  const getHint = (guessVal, correctVal, isNumeric) => {
    if (isNumeric && guessVal !== correctVal) {
      if (typeof guessVal === 'number' && typeof correctVal === 'number') {
           if (guessVal > correctVal) return "down";
           if (guessVal < correctVal) return "up";
      }
    }
    return "";
  };

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

  return (
    // Container for a single guess result row.
    // Use a responsive grid layout.
    // Below 'sm' breakpoint, grid-cols-4.
    // On 'sm' and up, grid-cols-7.
    // gap-1 for 4px space between items. max-w-5xl limits the row width.
    // items-stretch makes items fill cell height.
    <div className="w-full grid grid-cols-4 gap-1 max-w-5xl
                    sm:grid-cols-7 sm:gap-1
                    items-stretch">

      {/* Character Image/Name Card */}
      {/* This card spans 1 column and is square (aspect-square). */}
      {/* Border and rounded classes are kept as in your code. */}
      <div className="flex flex-col w-full border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[8px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] shadow overflow-hidden
                      col-span-1 aspect-square">
         {/* Dark Top Bar for Label */}
        <div className="bg-gray-800 text-white text-center font-bold text-xs leading-tight py-1 px-1 truncate flex-shrink-0">
          CHARACTER
        </div>
        {/* Image Content Area */}
        <div className="flex-grow flex items-center justify-center bg-white">
            {guess.image ? (
              <img
                src={guess.image}
                alt={guess.id}
                className="w-full h-full object-cover"
                onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = '/icons/placeholder.png';
                     e.target.classList.add('p-4', 'bg-gray-200', 'object-contain');
                     e.target.classList.remove('object-cover');
                     e.target.alt = "Image not available";
                 }}
              />
            ) : (
               <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center p-2">
                   No Image
               </div>
            )}
        </div>
      </div>

      {/* Map over other attributes to create cards */}
      {attributes.map((attr) => {
          const guessValue = getAttributeValue(guess, attr.field, lang);
          const correctValue = getAttributeValue(answer, attr.field, lang);
          const bgColor = getColor(guessValue, correctValue, attr.isNumeric);
          const hint = getHint(guessValue, correctValue, attr.isNumeric);
          const displayValue = (guessValue !== null && guessValue !== undefined) ? String(guessValue) : '—';

          return (
            // Attribute Card Container
            // Spans 1 column and is square (aspect-square).
            // Border and rounded classes are kept as in your code.
            <div key={attr.field} className="flex flex-col w-full border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[8px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] shadow overflow-hidden
                                           col-span-1 aspect-square">
              {/* Dark Top Bar for the attribute label */}
              <div className="bg-gray-800 text-white text-center font-bold text-xs leading-tight py-1 px-1 truncate flex-shrink-0">
                {attr.label.toUpperCase()}
              </div>
              {/* Content Area with Color */}
              <div
                className={`flex-grow flex flex-col items-center justify-center text-center px-1 py-1 font-bold text-sm leading-tight ${typeof displayValue === 'string' && displayValue.length > 0 ? 'capitalize' : ''}`}
                style={{ backgroundColor: bgColor, color: '#FFFFFF' }}
              >
                {renderArrow(hint)}
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
