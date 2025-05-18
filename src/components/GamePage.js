import React, { useState, useEffect, useRef } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'; 

// NEW, CORRECT PATHS in GamePage.js
import GuessForm from "./GuessForm";
import ResultRow from "./ResultRow";
import Header from "./Header";

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

  // Animation Logic for first guess
  useGSAP(() => {
    if (guesses.length === 1 && titleRef.current && searchRef.current) {
       const titleElement = titleRef.current;
       const searchElement = searchRef.current;
       const tl = gsap.timeline();

       tl.to(titleElement, {
         y: -100,
         opacity: 1,
         duration: 0.8,
         ease: "power3.out",
       });

       tl.fromTo(searchElement,
         { opacity: 0, y: 50 },
         { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
         ">-0.5"
       );
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

    if (correctAnswer && found.id === correctAnswer.id) {
        console.log("¡Felicidades! ¡Adivinaste correctamente!");
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

  const mainContainerClasses = `min-h-screen flex flex-col items-center font-satoshi ${guesses.length === 0 ? 'justify-center' : 'justify-start pt-6'}`;

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }}
    >
      {/* Apply initial opacity: 0 directly in the style to ensure it starts invisible */}
      <div
        ref={pageContainerRef}
        className={mainContainerClasses}
        style={{ opacity: 0 }} // Start invisible
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
      </div>
    </div>
  );
}

export default GamePage;
