// src/data/characterOfTheDay.js
import { characters } from "./characters"; // Make sure this path is correct

const selectDailyCharacter = (chars) => {
    if (!chars || chars.length === 0) {
        console.error("Characters list is empty, cannot select character of the day.");
        return null;
    }
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % chars.length;
    return chars[index];
};

export const characterOfTheDay = selectDailyCharacter(characters);
export { characters }; // Export the list for App.js and GuessForm
