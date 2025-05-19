// Modified GamePage.js
import React, { useState, useEffect, useRef } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'; 

import GuessForm from "./GuessForm";
import ResultRow from "./ResultRow";
import Header from "./Header";
import WinnerModal from "./WinnerModal"; // Add this import

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

function GamePage() {
  const [guesses, setGuesses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const pageContainerRef = useRef(null);
  const [allCharacters, setAllCharacters] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false); // Add this state
  
  // Animation state to control when animation has completed
  const [animationComplete, setAnimationComplete] = useState(false);

  // GSAP Enter Animation with more noticeable effect and longer duration
  useEffect(() => {
    // Only run animation after loading is complete
    if (!loading && pageContainerRef.current) {
      // Set initial state manually to ensure it's in the starting position
      gsap.set(pageContainerRef.current, { y: 50, opacity: 0 });
      
      // More noticeable animation with longer duration
      gsap.to(pageContainerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2, // Longer duration to make it more noticeable
        ease: "power2.out",
        delay: 0.2, // Small delay to ensure DOM is ready
        onComplete: () => setAnimationComplete(true)
      });
    }
  }, [loading]); // Run when loading state changes to false

  // API Fetching Logic
  useEffect(() => {
      const fetchCharacters = async () => {
        setLoading(true);
        try {
          const response = await fetch("https://dragonball-api.com/api/characters?limit=58");

          if (!response.ok) {
             const errorText = await response.text();
             throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          const responseData = await response.json();

          const apiCharacters = responseData.items;

          if (!apiCharacters || apiCharacters.length === 0) {
               throw new Error("API returned empty characters list.");
          }

          const processedCharacters = apiCharacters.map(apiChar => {
              return {
        id: apiChar.id ? apiChar.id.toString() : 'unknown',
        name_es: apiChar.name || apiChar.id,
        image: apiChar.image || '/icons/placeholder.png',
        gender_es: apiChar.gender || 'Desconocido',
        race_es: apiChar.race || 'Desconocido',
        affiliation_es: apiChar.affiliation || 'Desconocido',
        
        // Add Ki and Max Ki values
        // If these values are available in your API, use them directly
        // Otherwise, we'll generate random values for demonstration
        ki: apiChar.ki || Math.floor(Math.random() * 10000) + 1000,
        maxKi: apiChar.maxKi || Math.floor(Math.random() * 100000) + 10000,
        
        // Other attributes
        deaths: 0,
        serie_es: 'Desconocida',
        saga_es: 'Desconocida',
        origin_es: 'Desconocido',
    };
          })
          .filter(char => char.id && char.name_es !== 'Desconocido' && char.image);

          console.log("Fetched and Processed Characters:", processedCharacters);
          setAllCharacters(processedCharacters);
          const dailyChar = selectCharacterOfTheDay(processedCharacters);
          setCorrectAnswer(dailyChar);
        } catch (error) {
          console.error("Error fetching characters:", error);
          setAllCharacters([]);
          setCorrectAnswer(null);
        } finally {
          setLoading(false); // This will trigger the animation
        }
      };

      fetchCharacters();
  }, []);

  // Animation Logic for first guess - we'll modify this
  useGSAP(() => {
    if (guesses.length === 1 && titleRef.current && searchRef.current) {
       const titleElement = titleRef.current;
       const searchElement = searchRef.current;
       const tl = gsap.timeline();

       // Instead of moving the title up, we'll just make it smaller
       tl.to(titleElement, {
         scale: 0.8,
         y: -20, // Move up slightly but not as much
         duration: 0.8,
         ease: "power3.out",
       });

       // No need to animate the search bar since it will stay in place
    }
  }, [guesses]);

  const handleGuess = (name) => {
    const found = allCharacters.find((char) =>
        char.id.toLowerCase() === name.toLowerCase() ||
        (char.name_es && char.name_es.toLowerCase() === name.toLowerCase())
    );

    if (!found) {
      console.log("Personaje no encontrado!");
      return;
    }

    if (guesses.some(guess => guess.id === found.id)) {
         console.log(`¡El personaje "${found.name_es || found.id}" ya ha sido adivinado!`);
         return;
     }

    setGuesses((prev) => [found, ...prev]);
    setSearchInput('');

    // Check if the guess is correct and show winner modal
    if (correctAnswer && found.id === correctAnswer.id) {
        console.log("¡Felicidades! ¡Adivinaste correctamente!");
        setShowWinnerModal(true);
    }
  };

  const availableCharacters = allCharacters.filter(char =>
      !guesses.some(guessedChar => guessedChar.id === char.id)
  );

  if (loading) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center font-satoshi"
           style={{ background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }}>
        <p className="text-black">Cargando personajes...</p>
      </div>
     );
  }

  if (!correctAnswer && !loading) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 font-satoshi"
           style={{ background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }}>
        <Header />
        <div className="text-center mt-8 text-red-600 font-bold">
            Error: No se pudieron cargar los datos de los personajes o el personaje del día desde la API.
        </div>
      </div>
    );
  }

  // Modified layout - no longer changes justify-center based on guesses
  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }}
    >
      <div
        ref={pageContainerRef}
        className="min-h-screen flex flex-col items-center font-satoshi pt-6" // Always start from top
        style={{ opacity: 0 }} // Start invisible
      >
        <Header />

        {/* Title and Search always at the top */}
        <div className="flex flex-col items-center w-full max-w-5xl mb-8">
          <div ref={titleRef} className="text-center mt-4 mb-6">
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

        {/* Results below the search */}
        {guesses.length > 0 && (
          <div className="w-full max-w-5xl flex flex-col items-center gap-4 pb-8">
              {guesses.map((guess) => (
                <ResultRow
                  key={guess.id}
                  guess={guess}
                  answer={correctAnswer}
                />
              ))}
          </div>
        )}
        
        {/* Winner Modal */}
        <WinnerModal 
          isOpen={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          correctCharacter={correctAnswer}
        />
      </div>
    </div>
  );
}

export default GamePage;
