import React, { useState, useEffect } from "react";
// Import both characters and characterOfTheDay from the data file
import { characters, characterOfTheDay } from "./data/characterOfTheDay";

import GuessForm from "./components/GuessForm";
import ResultRow from "./components/ResultRow";
import Header from "./components/Header";
// Assuming you have a LoadingSpinner component, or you can remove this
// import LoadingSpinner from "./components/LoadingSpinner";


function App() {
  const [lang, setLang] = useState("en"); // State for selected language
  const [guesses, setGuesses] = useState([]); // State to store guesses

  // State to hold the list of all characters (initialized from local data)
  const [allCharacters, setAllCharacters] = useState(characters);

  // State to hold the character of the day (initialized from local data)
  const [correctAnswer, setCorrectAnswer] = useState(characterOfTheDay);

  // State for loading (set to false as we're using local data now)
  const [loading, setLoading] = useState(false); // Set to true if fetching

  // --- API Fetching Logic (Commented out for local data usage) ---
  /*
  useEffect(() => {
      const fetchCharacters = async () => {
        setLoading(true);
        try {
          // Replace with your actual API endpoint when ready
          const response = await fetch("YOUR_API_ENDPOINT/characters");
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setAllCharacters(data); // Update all characters
          // If API provides character of the day:
          // setCorrectAnswer(data.dailyCharacter);
          // If you need to select it from the fetched list:
          const today = new Date();
          const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
          const index = dayOfYear % data.length;
          setCorrectAnswer(data[index]); // Select character of the day

        } catch (error) {
          console.error("Error fetching characters:", error);
          setAllCharacters([]); // Clear characters on error
          setCorrectAnswer(null); // Clear character of the day on error
          // You might want to display an error message to the user here
        } finally {
          setLoading(false);
        }
      };
      // Uncomment the line below to fetch from API when the component mounts
      // fetchCharacters();
  }, []); // Empty dependency array: runs only once on mount
  */
  // -------------------------------------------------------------------


  // Handle a new guess
  const handleGuess = (name) => {
    // Find the character in the list of all characters (case-insensitive)
    const found = allCharacters.find((char) => char.id.toLowerCase() === name.toLowerCase());

    // If character not found, show an alert (you might want a better UI)
    if (!found) {
      alert("Character not found! Please select from the list.");
      return;
    }

     // Optional: Prevent duplicate guesses
    // if (guesses.some(guess => guess.id === found.id)) {
    //     alert("You already guessed this character!");
    //     return;
    // }

    // Add the found character to the list of guesses at the beginning (newest first)
    setGuesses((prev) => [found, ...prev]);

    // Check for win condition
    if (correctAnswer && found.id === correctAnswer.id) {
        console.log("Congratulations! You guessed correctly!");
        // Implement your win state logic here (e.g., show a modal)
    }
  };

  // --- Loading and Error Rendering ---
  // Display loading spinner while fetching data (if fetching is enabled)
  if (loading) {
    // return <LoadingSpinner />; // Use your loading component
     return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p>Loading characters...</p> {/* Simple loading text */}
      </div>
     );
  }

  // Display an error message if the character of the day could not be loaded
  if (!correctAnswer && !loading) {
     return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-6 font-satoshi"> {/* Changed font here too */}
        <Header lang={lang} setLang={setLang} />
        <div className="text-center mt-8 text-red-600 font-bold">
            Error: Could not load character data or character of the day.
        </div>
      </div>
    );
  }
  // ------------------------------------


  // Main application render
  return (
    // Apply Satoshi font globally to the main container
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-12 px-4 font-satoshi"> {/* <-- Changed font-sans to font-satoshi */}

      {/* Header Component */}
      <Header lang={lang} setLang={setLang} />

      {/* Main Title and Subtitle Area */}
      {/* Font will be inherited, but you can add font-bold or font-black if needed */}
      <div className="text-center mt-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-black"> {/* Kept font-black */}
          Guess today's Dragon Ball character
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mt-2">
          Last update: DB Super The Tournament of Power {/* Example text, can be dynamic */}
        </p>
      </div>

      {/* Guess Input Form */}
      {/* GuessForm already uses font-satoshi */}
      <GuessForm
        onGuess={handleGuess}
        characters={allCharacters}
        lang={lang}
      />

      {/* Area to display previous guesses */}
       {/* ResultRow content will inherit font-satoshi */}
      <div className="w-full max-w-5xl mt-8 flex flex-col items-center gap-4">
          {/* Map over the guesses state and render a ResultRow for each */}
          {guesses.map((guess, index) => (
            <ResultRow
              key={index}
              guess={guess}
              answer={correctAnswer}
              lang={lang}
            />
          ))}
      </div>

       {/* You will add logic here later to display a win or lose screen/modal */}

    </div>
  );
}

export default App;
