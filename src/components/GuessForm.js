import { useState, useEffect, useRef, forwardRef } from "react"; // Import forwardRef


// Wrap the component in forwardRef to accept a ref prop
const GuessForm = forwardRef(({ value, onChange, onGuess, characters = [] }, ref) => {
  const [filtered, setFiltered] = useState([]);
  const formRef = useRef(null); // Still use internal ref for outside click


  // Effect for filtering characters based on the `value` prop (input content)
  useEffect(() => {
      if (value.length > 0 && characters.length > 0) {
        const lowerInput = value.toLowerCase();
        const matches = characters.filter((char) =>
            char.id.toLowerCase().includes(lowerInput) ||
            (char.name_es && char.name_es.toLowerCase().includes(lowerInput))
        );
        setFiltered(matches);
      } else {
        setFiltered([]);
      }
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
       onGuess(value.trim());
    }
     setFiltered([]); // Hide dropdown after submission attempt
  };

  // Handle selecting a character from the autocomplete list
  const handleSelect = (id) => {
    onGuess(id); // Submit the selected character ID
    setFiltered([]); // Hide the dropdown
  };

  return (
    // Attach BOTH the forwarded ref AND the internal ref to the main container div
    // The forwarded ref is for the parent (App.js) to target with GSAP
    // The internal ref is for this component's own outside click logic
    <div ref={(node) => { formRef.current = node; if (ref) ref.current = node; }} // Combine refs
         className="relative w-full max-w-xl font-satoshi font-black ">
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
      {value.length > 0 && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-black mt-1 w-full rounded-md shadow max-h-60 overflow-y-auto">
          {filtered.map((char) => (
            <li
              key={char.id}
              onClick={() => handleSelect(char.id)}
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
              <span className="capitalize font-medium text-gray-800">
                  {char.name_es || char.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}); // Close forwardRef

export default GuessForm;
