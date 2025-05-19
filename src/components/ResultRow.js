// Modified ResultRow.js
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function ResultRow({ guess, answer }) {
  const rowRef = useRef(null);

  // GSAP animation effect - Runs when the ResultRow component mounts
  useEffect(() => {
    if (rowRef.current) {
      const cards = rowRef.current.children;
      gsap.set(cards, {
        opacity: 0,
        y: 20
      });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out"
      });
    }
  }, []);

  if (!guess || !answer || guess.id === "Not found") {
       return null;
  }

  // Define the attributes to display - Now with Ki and Max Ki
  const attributes = [
    { label: "Género", field: "gender", isNumeric: false },
    { label: "Raza", field: "race", isNumeric: false },
    { label: "Afiliación", field: "affiliation", isNumeric: false },
    { label: "Ki", field: "ki", isNumeric: true }, // Added Ki attribute
    { label: "Ki Máximo", field: "maxKi", isNumeric: true } // Added Max Ki attribute
  ];

  // Function to get the attribute value
  const getAttributeValue = (character, field) => {
      if (!character) return null;

      const spanishField = `${field}_es`;
      if (character[spanishField] !== undefined) {
          return character[spanishField];
      }

      if (character[field] !== undefined) {
          return character[field];
      }

      return 'Desconocido';
  };

  // Color and Hint logic
  const getColor = (guessVal, correctVal, isNumeric) => {
      if (guessVal != null && correctVal != null && guessVal == correctVal) {
          return "#83DA38"; // Green
      }

      if (isNumeric) {
          if (guessVal != null && correctVal != null) {
               return "#E9B23C"; // Orange/Yellow
          }
           return "#DA3434"; // Red
      } else {
           return "#DA3434"; // Red
      }
  };

  const getHint = (guessVal, correctVal, isNumeric) => {
    if (isNumeric && guessVal != correctVal) {
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

  const characterDisplayName = guess.name_es || guess.id;

  // Calculate how many columns we need in our grid
  // 1 for character + 5 for attributes = 6 columns
  const gridCols = "grid-cols-6";

  return (
    <div ref={rowRef} className={`w-full grid ${gridCols} gap-1 max-w-5xl items-stretch`}>
      {/* Character Image/Name Card */}
      <div className="flex flex-col w-full border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[8px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[24px] shadow overflow-hidden
                      col-span-1 aspect-square">
        <div className="bg-gray-800 text-white text-center font-bold text-xs leading-tight py-1 px-1 truncate flex-shrink-0">
          {characterDisplayName.toUpperCase()}
        </div>
        <div className="flex-grow flex items-center justify-center bg-white">
            {guess.image ? (
              <img
                src={guess.image}
                alt={guess.id}
                className="w-full h-full object-cover p-[2px]"
                onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = '/icons/placeholder.png';
                     e.target.classList.add('p-4', 'bg-gray-200', 'object-contain');
                     e.target.classList.remove('object-cover', 'p-[2px]');
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

      {/* Map over all attribute cards */}
      {attributes.map((attr) => {
          const guessValue = getAttributeValue(guess, attr.field);
          const correctValue = getAttributeValue(answer, attr.field);
          const bgColor = getColor(guessValue, correctValue, attr.isNumeric);
          const hint = getHint(guessValue, correctValue, attr.isNumeric);
          const displayValue = (guessValue !== null && guessValue !== undefined) ? String(guessValue) : '—';

          return (
            <div key={attr.field} className="flex flex-col w-full border-t-2 border-l-2 border-r-2 border-b-4 border-black rounded-tl-[8px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[24px] shadow overflow-hidden
                                           col-span-1 aspect-square">
              <div className="bg-gray-800 text-white text-center font-bold text-xs leading-tight py-1 px-1 truncate flex-shrink-0">
                {attr.label.toUpperCase()}
              </div>
              <div
                className={`flex-grow flex flex-col items-center justify-center text-center px-1 py-1 font-bold text-sm leading-tight ${typeof guessValue === 'string' && guessValue.length > 0 ? 'capitalize' : ''}`}
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
