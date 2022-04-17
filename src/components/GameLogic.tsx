namespace Util {
  export const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
}

namespace Game {
  // Type definitions
  export type CorrectType = { str: string; color: string }[];
  export type StateType = {
    game: {
      letters: string;
      words: string[];
      source?: string;
      dict: {
        name: string;
        url: string;
      };
    };
    correct: Game.CorrectType;
    guess: string;
    timeout: ReturnType<typeof setTimeout> | undefined;
  };

  // Functions
  export const getLetters = (amount: number) => {
    function getLetter() {
      return String.fromCharCode("a".charCodeAt(0) + Util.rand(0, 25));
    }

    let letters = "";
    let char = getLetter();
    for (let i = 0; i < amount; ++i) {
      while (letters.includes(char)) {
        char = getLetter();
      }

      letters = letters.concat(char);
    }

    // Alphabetic sorting while keeping main letter at index 0...
    return letters[0].concat(letters.slice(1).split("").sort().join(""));
  };

  export const getWords = async (
    dict: { name: string; url: string },
    letters: string
  ): Promise<Game.StateType["game"]> => {
    const res = await fetch(dict.url);
    const obj: { data: string; credits: string } = await res.json();
    const words = obj.data;

    const re = new RegExp(`\\b[${letters}]+\\b`, "gi");
    const found = words.match(re);

    //@ts-ignore
    let valid = [...new Set(found)];
    valid = valid.filter(
      (word) => word.length > 3 && word.includes(letters[0])
    );

    return { dict: dict, letters: letters, words: valid, source: obj.credits };
  };

  export const getScore = (state: Game.StateType) => {
    const ratio = state.correct.length / state.game.words.length;
    if (ratio === 1) return "Winner";
    if (ratio >= 0.9) return "King";
    if (ratio >= 0.75) return "Professional";
    if (ratio >= 0.6) return "Advanced";
    if (ratio >= 0.25) return "Intermediate";
    return "Beginner";
  };
}

export default Game;
