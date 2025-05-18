// src/components/GamePage.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion'; // Import motion
import gsap from 'gsap';
// import { useGSAP } from '@gsap/react'; // If you were using this

import GuessForm from "./GuessForm";
import ResultRow from "./ResultRow";
import Header from "./Header";
// import LoadingSpinner from "./LoadingSpinner";


// --- Define Page Animation Variants (can be the same as HomePage or different) ---
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20, // Or y: 20 for a different exit direction
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate', // Or "easeInOut", "circOut", etc.
  duration: 0.5,
};
// --- End Page Animation Variants ---


// Function to select character of the day
const selectCharacterOfTheDay = (chars) => {
    if (!chars || chars.length === 0) {
        console.error("Characters list is empty, cannot select character of the day.");
        return null;
    }
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % chars.length;
    return chars[index];
};


// Renamed from App to GamePage
function GamePage() {
  const [guesses, setGuesses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [allCharacters, setAllCharacters] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  const titleRef = useRef(null);
  const searchRef = useRef(null);

  // API Fetching Logic (from your working GamePage.js)
  useEffect(() => {
      const fetchCharacters = async () => {
        setLoading(true);
        try {
          const response = await fetch("https://www.dragonball-api.com/api/characters?limit=58");
          if (!response.ok) {
             const errorText = await response.text();
             throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          const responseData = await response.json();
          const apiCharacters = responseData.items;
          if (!apiCharacters || apiCharacters.length === 0) {
               throw new Error("API returned empty characters list.");
          }
          const processedCharacters = apiCharacters.map(apiChar => ({
              id: apiChar.id ? apiChar.id.toString() : 'unknown',
              name_es: apiChar.name || apiChar.id,
              image: apiChar.image || '/icons/placeholder.png',
              gender_es: apiChar.gender || 'Desconocido', // You'll need your translateAttribute or map directly
              race_es: apiChar.race || 'Desconocido',
              affiliation_es: apiChar.affiliation || 'Desconocido',
              deaths: 0,
              serie_es: 'Desconocida',
              saga_es: 'Desconocida',
              origin_es: 'Desconocido',
          })).filter(char => char.id && char.name_es !== 'Desconocido' && char.image);

          console.log("Fetched and Processed Characters (GamePage):", processedCharacters);
          setAllCharacters(processedCharacters);
          const dailyChar = selectCharacterOfTheDay(processedCharacters);
          setCorrectAnswer(dailyChar);
        } catch (error) {
          console.error("Error fetching characters (GamePage):", error);
          setAllCharacters([]);
          setCorrectAnswer(null);
        } finally {
          setLoading(false);
        }
      };
      fetchCharacters();
  }, []);

  // GSAP Animation for title and search bar
  // If using useGSAP, ensure it's imported: import { useGSAP } from '@gsap/react';
  useEffect(() => { // Reverted to standard useEffect for simplicity here
    if (guesses.length === 1 && titleRef.current && searchRef.current) {
       const titleElement = titleRef.current;
       const searchElement = searchRef.current;
       const tl = gsap.timeline();
       tl.to(titleElement, { y: -100, opacity: 1, duration: 0.8, ease: "power3.out" });
       tl.fromTo(searchElement, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">-0.5");
    }
  }, [guesses]);


  const handleGuess = (name) => {
    const found = allCharacters.find((char) =>
        char.id.toLowerCase() === name.toLowerCase() ||
        (char.name_es && char.name_es.toLowerCase() === name.toLowerCase())
    );
    if (!found) { console.log("Personaje no encontrado!"); return; }
    if (guesses.some(guess => guess.id === found.id)) {
         console.log(`¡El personaje "${found.name_es || found.id}" ya ha sido adivinado!`);
         return;
     }
    setGuesses((prev) => [found, ...prev]);
    setSearchInput('');
    if (correctAnswer && found.id === correctAnswer.id) {
        console.log("¡Felicidades! ¡Adivinaste correctamente!");
    }
  };

  const availableCharacters = allCharacters.filter(char =>
      !guesses.some(guessedChar => guessedChar.id === char.id)
  );

  // Loading state
  if (loading) {
     return (
      // Wrap loading state with motion.div for consistent exit/enter if needed
      <motion.div
        initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
        className="min-h-screen bg-[#EDECEA] flex flex-col items-center justify-center font-satoshi"
      >
        <p className="text-black">Cargando personajes...</p>
      </motion.div>
     );
  }

  // Error state
  if (!correctAnswer && !loading) {
     return (
      <motion.div
        initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
        className="min-h-screen bg-[#EDECEA] flex flex-col items-center justify-center px-4 py-6 font-satoshi"
      >
        <Header />
        <div className="text-center mt-8 text-red-600 font-bold">
            Error: No se pudieron cargar los datos de los personajes o el personaje del día desde la API.
        </div>
      </motion.div>
    );
  }

  const mainContainerClasses = `min-h-screen bg-[#EDECEA] flex flex-col items-center font-satoshi ${guesses.length === 0 ? 'justify-center' : 'justify-start pt-6'}`;

  return (
    // Wrap the main content of GamePage with motion.div
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={mainContainerClasses} // Use your dynamic classes
    >
      <Header />
      <div className="flex flex-col items-center w-full max-w-5xl">
        <div ref={titleRef} className="text-center mt-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-black">
            Adivina el personaje de hoy
          </h1>
        </div>
        <GuessForm
          ref={searchRef}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onGuess={handleGuess}
          characters={availableCharacters}
        />
      </div>
      {guesses.length > 0 && (
        <div className="w-full max-w-5xl mt-8 flex flex-col items-center gap-4">
            {guesses.map((guess) => (
              <ResultRow
                key={guess.id}
                guess={guess}
                answer={correctAnswer}
              />
            ))}
        </div>
      )}
    </motion.div>
  );
}

export default GamePage;
