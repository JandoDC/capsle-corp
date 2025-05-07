import React, { useState, useEffect } from "react";
// REMOVE the local data import as we'll fetch from API
// import { characters, characterOfTheDay } from "./data/characterOfTheDay";

import GuessForm from "./components/GuessForm";
import ResultRow from "./components/ResultRow";
import Header from "./components/Header";
// Assuming you have a LoadingSpinner component, or you can remove this
// import LoadingSpinner from "./components/LoadingSpinner";


// --- Simple Translation Mapping (English API terms to Spanish app terms) ---
// Add more mappings here as needed if you find new values in race, gender, affiliation
const translateAttribute = (value, field) => {
    if (!value) return 'Desconocido'; // Default for null/undefined

    const lowerValue = value.toLowerCase();

    if (field === 'gender') {
        if (lowerValue === 'male') return 'Masculino';
        if (lowerValue === 'female') return 'Femenino';
        if (lowerValue === 'genderless') return 'Sin género';
        return value; // Keep original if no mapping found
    }

    if (field === 'race') {
        if (lowerValue === 'saiyan') return 'Saiyajin';
        if (lowerValue === 'human') return 'Humano';
        if (lowerValue === 'namekian') return 'Namekiano';
        if (lowerValue === 'frieza race') return 'Raza de Freezer';
        if (lowerValue === 'android') return 'Androide';
         if (lowerValue === 'majin') return 'Majin';
         // Add more races if you encounter them in the API response
        return value;
    }

    if (field === 'affiliation') {
        if (lowerValue === 'z fighter') return 'Guerrero Z';
        if (lowerValue === 'army of frieza') return 'Ejército de Freezer';
        if (lowerValue === 'freelancer') return 'Independiente'; // Or 'Libre'
        if (lowerValue === 'red ribbon army') return 'Ejército Red Ribbon';
        // Add more affiliations
        return value;
    }

    // No translation needed for other fields, return original value
    return value;
};
// --- End Translation Mapping ---


// Function to select character of the day (adjusted to work with fetched data)
// *** NOTE: For a consistent character of the day across users/reloads,
// *** this selection logic should ideally be handled by the API/backend
const selectCharacterOfTheDay = (chars) => {
    if (!chars || chars.length === 0) {
        console.error("Characters list is empty after fetch, cannot select character of the day.");
        return null;
    }
    // Use today's date to pick a character index from the fetched list
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % chars.length;
    return chars[index];
};


function App() {
  // Removed language state: const [lang, setLang] = useState("en"); // Spanish only now

  const [guesses, setGuesses] = useState([]); // State to store guesses
  const [searchInput, setSearchInput] = useState(''); // State for search input

  // State to hold the list of all characters (initially empty, will be filled from API)
  const [allCharacters, setAllCharacters] = useState([]);

  // State to hold the character of the day (initially null, will be set after API fetch)
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // State for loading (set to true initially because we are fetching)
  const [loading, setLoading] = useState(true); // Set to true initially

  // --- API Fetching Logic ---
  useEffect(() => {
      const fetchCharacters = async () => {
        setLoading(true); // Start loading
        try {
          // Use the API endpoint with limit=58 to get all characters (assuming this works)
          // Based on the meta data showing 58 total, limit=58 *should* return all on one page.
          const response = await fetch("https://dragonball-api.com/api/characters?limit=58"); // <--- Corrected fetch URL

          if (!response.ok) {
             // Handle non-200 HTTP responses
             const errorText = await response.text();
             throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          const responseData = await response.json(); // Parse the JSON response

          // --- Access the characters array from the 'items' property ---
          const apiCharacters = responseData.items; // <--- Access the 'items' array

          if (!apiCharacters || apiCharacters.length === 0) {
               throw new Error("API returned empty characters list.");
          }

          // --- Process and Map API Data to Your App's Structure ---
          // Map the API fields to your app's expected property names, performing translation where needed
          const processedCharacters = apiCharacters.map(apiChar => {
              return {
                  id: apiChar.id ? apiChar.id.toString() : 'unknown', // Use API ID, ensure string, handle missing
                  name_es: apiChar.name || apiChar.id, // Use API 'name' field (already Spanish), fallback to ID
                  image: apiChar.image || '/icons/placeholder.png', // Use API 'image' URL, fallback to placeholder

                  // --- Map and Translate API Fields ---
                  gender_es: translateAttribute(apiChar.gender, 'gender'),
                  race_es: translateAttribute(apiChar.race, 'race'),
                  affiliation_es: translateAttribute(apiChar.affiliation, 'affiliation'),

                  // --- Attributes NOT available from this API endpoint (setting defaults) ---
                  deaths: 0, // Default or you can curate locally
                  serie_es: 'Desconocida', // Default or curate locally
                  saga_es: 'Desconocida', // Default or curate locally
                  origin_es: 'Desconocido', // Default or curate locally (originPlanet was not in snippet)
              };
          })
           // Optional: Filter out characters missing essential data like ID or name if needed
           // Based on snippet, ID, name, image seem present for first 10.
          .filter(char => char.id && char.name_es !== 'Desconocido' && char.image);


          console.log("Fetched and Processed Characters:", processedCharacters); // Log to inspect data

          setAllCharacters(processedCharacters); // Update all characters state

          // Select character of the day from the PROCESSED fetched data
          const dailyChar = selectCharacterOfTheDay(processedCharacters);
          setCorrectAnswer(dailyChar); // Set the character of the day


        } catch (error) {
          console.error("Error fetching characters:", error);
          setAllCharacters([]); // Clear characters on error
          setCorrectAnswer(null); // Clear character of the day on error
          // You might want to display a user-friendly error message on the UI
        } finally {
          setLoading(false); // Stop loading regardless of success or failure
        }
      };

      // Run the fetch function when the component mounts
      fetchCharacters();

  }, []); // Empty dependency array: runs only once on mount


  // Handle a new guess attempt
  const handleGuess = (name) => {
    // Use the fetched allCharacters list for searching by ID or Spanish name
    const found = allCharacters.find((char) =>
        char.id.toLowerCase() === name.toLowerCase() ||
        (char.name_es && char.name_es.toLowerCase() === name.toLowerCase())
    );

    if (!found) {
      console.log("Personaje no encontrado!");
      return;
    }

    // Check if this character has already been guessed
    if (guesses.some(guess => guess.id === found.id)) {
         console.log(`¡El personaje "${found.name_es || found.id}" ya ha sido adivinado!`);
         return;
     }

    setGuesses((prev) => [found, ...prev]);
    setSearchInput(''); // Clear the input field after a successful guess

    // Check for win condition (optional for now)
    if (correctAnswer && found.id === correctAnswer.id) {
        console.log("¡Felicidades! ¡Adivinaste correctamente!");
        // Implement win state (e.g., show a modal)
    }
  };

  // Filter the list of characters available for guessing for the GuessForm autocomplete
  const availableCharacters = allCharacters.filter(char =>
      !guesses.some(guessedChar => guessedChar.id === char.id)
  );

  // --- Loading and Error Rendering ---
  if (loading) {
     return (
      <div className="min-h-screen bg-[#EDECEA] flex flex-col items-center justify-center font-satoshi">
        <p className="text-black">Cargando personajes...</p>
      </div>
     );
  }

  if (!correctAnswer && !loading) {
     return (
      <div className="min-h-screen bg-[#EDECEA] flex flex-col items-center justify-center px-4 py-6 font-satoshi">
        <Header />
        <div className="text-center mt-8 text-red-600 font-bold">
            Error: No se pudieron cargar los datos de los personajes o el personaje del día desde la API.
        </div> {/* Updated error message */}
      </div>
    );
  }
  // ------------------------------------


  // Main application render
  return (
    <div className="min-h-screen bg-[#EDECEA] flex flex-col items-center pt-6 pb-12 px-4 font-satoshi">

      {/* Header Component */}
      <Header />

      {/* Main Title and Subtitle Area - Updated to Spanish */}
      <div className="text-center mt-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-black">
          Adivina el personaje de hoy
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mt-2">
          Última actualización: DB Super Torneo del Poder
        </p>
      </div>

      {/* Guess Input Form */}
      <GuessForm
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onGuess={handleGuess}
        characters={availableCharacters} // Pass the filtered list
        // Language prop is removed
      />

      {/* Area to display previous guesses */}
      <div className="w-full max-w-5xl mt-8 flex flex-col items-center gap-4">
          {guesses.map((guess) => (
            <ResultRow
              key={guess.id}
              guess={guess}
              answer={correctAnswer}
            />
          ))}
      </div>

       {/* Add win/lose logic here */}

    </div>
  );
}

export default App;
