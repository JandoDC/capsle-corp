// src/components/GuessForm.js - No changes needed from the previous version for API integration
import { useState, useEffect, useRef } from "react";

// Accept value, onChange, onGuess, and characters (removed lang)
function GuessForm({ value, onChange, onGuess, characters = [] }) {
  const [filtered, setFiltered] = useState([]);
  const formRef = useRef(null);

  // Effect for filtering characters based on the `value` prop (input content)
  useEffect(() => {
      if (value.length > 0 && characters.length > 0) {
        const lowerInput = value.toLowerCase();
        const matches = characters.filter((char) =>
            // Filter by ID or Spanish name (name_es)
            char.id.toLowerCase().includes(lowerInput) ||
            (char.name_es && char.name_es.toLowerCase().includes(lowerInput))
        );
        setFiltered(matches);
      } else {
        setFiltered([]);
      }
      // Dependency array includes value and characters
  }, [value, characters]);


   // Effect to close the autocomplete dropdown when clicking outside
   useEffect(() => {
       const handleClickOutside = (event) => {
           if (formRef.current && !formRef.current.contains(event.target)) {
               setFiltered([]);
           }
       };

       if (filtered.length > 0) {
           document.addEventListener("mousedown", handleClickOutside);
       } else {
           document.removeEventListener("mousedown", handleClickOutside);
       }

       return () => {
           document.removeEventListener("mousedown", handleClickOutside);
       };
   }, [filtered]);


  // Handle changes in the input field
  const handleChange = (e) => {
    onChange(e); // Update the state in App.js
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
       // Call onGuess with the trimmed value (should be character ID or name)
       onGuess(value.trim()); // App.js will find the character object
    }
     setFiltered([]); // Hide dropdown after submission attempt
  };

  // Handle selecting a character from the autocomplete list
  const handleSelect = (id) => {
    // When selecting, call onGuess with the selected ID
    onGuess(id); // Submit the selected character ID
    setFiltered([]); // Hide the dropdown
  };

  return (
    <div ref={formRef} className="relative w-full max-w-xl font-satoshi font-black ">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Busca un personaje"
          value={value}
          onChange={handleChange}
          className="w-full border-t-4 border-l-4 border-r-4 border-b-8 border-[#1E2224] rounded-tl-[8px] rounded-tr-[24px] rounded-br-[8px] rounded-bl-[24px] px-6 py-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#EDECEA]"
          disabled={characters.length === 0}
          autoComplete="off"
          aria-label="Busca un personaje"
        />
      </form>

      {/* Autocomplete Dropdown List */}
      {/* Show dropdown only if `value` (input content) is not empty and there are filtered results */}
      {value.length > 0 && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-black mt-1 w-full rounded-md shadow max-h-60 overflow-y-auto">
          {filtered.map((char) => (
            <li
              key={char.id}
              onClick={() => handleSelect(char.id)} // Use character ID when selecting
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-100"
            >
              {char.image && (
                <img
                  src={char.image}
                  alt={char.id}
                  className="w-9 h-9 object-cover rounded border border-gray-300"
                   onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              {/* Display Spanish name (name_es) or fallback to ID */}
              <span className="capitalize font-medium text-gray-800">
                  {char.name_es || char.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GuessForm;
