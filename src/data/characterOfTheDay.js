import { characters } from "./characters"; // Import the full list of characters

// Function to select a character based on the current date
const selectDailyCharacter = (chars) => {
    if (!chars || chars.length === 0) {
        console.error("Characters list is empty, cannot select character of the day.");
        return null;
    }
    // Use today's date to pick a character index
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % chars.length;
    return chars[index];
};

// Select the character of the day when the app loads
export const characterOfTheDay = selectDailyCharacter(characters);

// Also export the full characters list for use in other components (like GuessForm)
export { characters };
