import { useState, useEffect, useRef } from "react";

// Accept onGuess, the list of characters, and the current language
function GuessForm({ onGuess, characters = [], lang }) {
  const [input, setInput] = useState(""); // State for the input field's value
  const [filtered, setFiltered] = useState([]); // State for characters matching the input
  const formRef = useRef(null); // Ref to the form container for outside click detection

  // Effect to filter characters based on input and available characters list
  useEffect(() => {
      // Only filter if there is text in the input and the characters list is not empty
      if (input.length > 0 && characters.length > 0) {
        const lowerInput = input.toLowerCase();
        // Filter characters whose 'id' includes the input (case-insensitive)
        // You could expand this to search names in the current language too
        const matches = characters.filter((char) =>
            char.id.toLowerCase().includes(lowerInput)
            // Optional: Add search by localized name
            // || (char[`name_${lang}`] && char[`name_${lang}`].toLowerCase().includes(lowerInput))
        );
        setFiltered(matches);
      } else {
        setFiltered([]); // Clear the filtered list if input is empty
      }
      // Add input, characters, and lang to the dependency array
  }, [input, characters, lang]); // Re-run effect if input, character list, or language changes

   // Effect to close the autocomplete dropdown when clicking outside the form area
   useEffect(() => {
       const handleClickOutside = (event) => {
           // Check if the clicked element is NOT inside the form container
           if (formRef.current && !formRef.current.contains(event.target)) {
               setFiltered([]); // Hide the dropdown by clearing the filtered list
           }
       };

       // Add the mousedown event listener to the document only when the dropdown is visible
       if (filtered.length > 0) {
           document.addEventListener("mousedown", handleClickOutside);
       } else {
           // Remove the event listener when the dropdown is hidden
           document.removeEventListener("mousedown", handleClickOutside);
       }

       // Cleanup function: removes the event listener when the component unmounts
       return () => {
           document.removeEventListener("mousedown", handleClickOutside);
       };
   }, [filtered]); // Re-run effect whenever the filtered list changes (dropdown visibility changes)


  // Handle changes in the input field
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value); // Update the input state
    // Filtering is automatically handled by the useEffect hook above
  };

  // Handle form submission (e.g., pressing Enter in the input)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    if (input.trim()) { // Check if the input has non-whitespace characters
       // Call the onGuess function passed from the parent (App.js)
       onGuess(input.trim());
       setInput(""); // Clear the input field after a guess is made
    }
     setFiltered([]); // Hide the dropdown after submission attempt
  };

  // Handle selection of a character from the autocomplete dropdown
  const handleSelect = (id) => {
    setInput(id); // Put the selected character's ID into the input field
    onGuess(id); // Submit the selected character ID as a guess
    setFiltered([]); // Hide the dropdown
  };

  return (
    // Main container for the form and dropdown, attach ref here
    <div ref={formRef} className="relative w-full max-w-xl font-satoshi font-black ">
      {/* The search form */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Search a character name" // Placeholder text
          value={input} // Connect input value to state
          onChange={handleChange} // Handle input changes
          // Apply styling from the image (border, rounded corners, shadow)
          // Add focus styles for better usability
          className="w-full border border-black rounded-lg px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          // Disable the input if no characters are loaded yet
          // Since characters is initialized with local data, this will be false initially
          disabled={characters.length === 0}
          autoComplete="off" // Disable browser's default autocomplete
          aria-label="Search for a character" // Accessibility label
        />
        {/* Optional: Add a visible submit button beside the input */}
      </form>

      {/* Autocomplete Dropdown List */}
      {/* Render the dropdown only if input is not empty AND there are matching characters */}
      {input.length > 0 && filtered.length > 0 && (
        // Position absolutely below the input, stack on top with z-10
        <ul className="absolute z-10 bg-white border border-black mt-1 w-full rounded-md shadow max-h-60 overflow-y-auto"> {/* Added max-height and overflow for scrolling */}
          {/* Map through filtered characters to create list items */}
          {filtered.map((char) => (
            <li
              key={char.id} // Use character ID as a unique key
              onClick={() => handleSelect(char.id)} // Handle clicking on a character in the list
              // Styling for list items: flex layout, spacing, hover effect
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-100"
            >
              {/* Display character image thumbnail if available */}
              {char.image && (
                <img
                  src={char.image}
                  alt={char.id} // Use character ID as alt text for accessibility
                  className="w-9 h-9 object-cover rounded border border-gray-300" // Styling for the thumbnail
                   onError={(e) => { e.target.style.display = 'none'; }} // Hide the <img> element if image fails to load
                />
              )}
              {/* Display character name (localized if available, otherwise ID) */}
              <span className="capitalize font-medium text-gray-800">
                  {char[`name_${lang}`] || char.id} {/* Access localized name or fallback to ID */}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GuessForm;
