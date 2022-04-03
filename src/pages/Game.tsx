/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React, { useEffect, useRef, useState } from "react";

import { BtnOutline } from "../components/Btn";
import Colored from "../components/Colored";
import Hive from "../components/Hive";

type GameState = {
  game: {
    letters: string;
    words: string[];
    source?: string;
  };
  guess: string;
  correct: string[];
};

const theme = {
  accent: "#F7DA43",
};

// TODO: cleanup code
// TODO: add points calculation system
// TODO: add URL system
// TODO: unfocus buttons when typing
// TODO: mobile ready
// TODO: press button when typing with kbd
function Game() {
  const styles = {
    container: css`
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      text-align: center;
    `,
    left: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    `,
    right: css`
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
    `,

    input: css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 75px;

      h1 {
        font-weight: normal;
      }
    `,

    // TODO: cursor positioning
    cursor: css`
      height: 50%;
      width: 2px;
      background-color: ${theme.accent};
      margin: 2px;

      animation: blink 1s step-start 0s infinite;

      @keyframes blink {
        50% {
          opacity: 0;
        }
      }
    `,

    nobtn: css`
      background: none;
      border: none;
      margin: 10px;
      padding: 0;
      border-radius: 50px;

      &:hover {
        cursor: pointer;
      }
    `,

    // TODO: hive elements positioning
    hive: css`
      margin-bottom: 10px;
    `,

    card: css`
      flex: 1;
      padding: 10px;
    `,

    cardContent: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      border: 1px solid #dddddd;
      height: 100%;
      border-radius: 10px;
      padding: 20px;
      padding-top: 0;
    `,

    btn: css`
      &:hover {
        transform: none;
      }

      margin: 0;
    `,

    score: css`
      display: flex;
      text-align: left;
      margin: 10px 10px;
      margin-bottom: 0;

      h3 {
        margin: 0;
        padding: 0;
      }
    `,

    footer: css`
      margin-bottom: 0;
    `,
  };

  const [state, _setState] = useState<GameState>({
    game: {
      letters: "",
      words: [],
      source: "",
    },
    correct: [],
    guess: "",
  });
  const stateRef = useRef(state);
  const setState = (data: GameState) => {
    stateRef.current = data;
    _setState(data);
  };

  // TODO: implement game URLs
  useEffect(() => {
    async function setup() {
      let game = await getWords("/words.json");
      while (game.words.length < 10) {
        game = await getWords("/words.json");
      }

      console.log(`${game.letters[0].toUpperCase()}, ${game.letters.slice(1)}`);
      console.log(game.words);
      setState({
        game: game,
        correct: [],
        guess: "",
      });
    }

    setup();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
    };
  });

  function handleKeys(event: KeyboardEvent) {
    switch (event.key) {
      case "Backspace":
        backspaceGuess();
        break;
      case "Enter":
        verifyGuess();
        break;

      default:
        if (
          !stateRef.current?.game.letters.includes(event.key.toLowerCase()) ||
          event.key.toLowerCase() < "a" ||
          event.key.toLowerCase() > "z" ||
          event.key.length > 1
        )
          break;
        concatGuess(event.key);
    }
  }

  function verifyGuess() {
    const state = stateRef.current;
    if (!state.guess || !state.game) return;

    setState({ ...state, guess: "" });
    if (
      state.game.words.includes(state.guess) &&
      !state.correct.includes(state.guess)
    ) {
      setState({
        ...state,
        correct: [...state.correct, state.guess],
        guess: "",
      });
    }
  }

  function backspaceGuess() {
    setState({
      ...stateRef.current,
      guess: stateRef.current.guess.slice(0, -1),
    });
  }

  function concatGuess(char: string) {
    setState({
      ...stateRef.current,
      guess: stateRef.current.guess.concat(char.toLowerCase()),
    });
  }

  function shuffleLetters() {
    const sr = stateRef.current;

    function shuffle(str: string) {
      return str
        .split("")
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join("");
    }
    setState({
      ...sr,
      game: {
        ...sr.game,
        letters: sr.game.letters[0].concat(shuffle(sr.game.letters.slice(1))),
      },
    });
  }

  function getScore() {
    const sr = stateRef.current;
    const ratio = sr.correct.length / sr.game.words.length;
    if (ratio === 1) return "Winner";
    if (ratio >= 0.9) return "King";
    if (ratio >= 0.75) return "Professional";
    if (ratio >= 0.6) return "Advanced";
    if (ratio >= 0.25) return "Intermediate";
    return "Beginner";
  }

  return (
    <div css={styles.container}>
      <div css={styles.left}>
        <div css={styles.input}>
          <Colored
            highlight={state.game.letters[0]}
            placeholder="Type or click"
            word={state.guess}
          />
          <div css={styles.cursor} />
        </div>

        <Hive
          letters={state.game.letters}
          callback={concatGuess}
          style={styles.hive}
        />

        {/* TODO: animate wrong guess */}
        {/* TODO: refactor buttons */}
        <div>
          <button
            css={styles.nobtn}
            onClick={() => {
              backspaceGuess();
            }}
          >
            <BtnOutline style={styles.btn}>Delete</BtnOutline>
          </button>
          <button
            css={styles.nobtn}
            onClick={() => {
              shuffleLetters();
            }}
          >
            <BtnOutline
              style={[
                styles.btn,
                css`
                  width: 50px;
                  padding-left: 10px;
                  padding-right: 10px;
                `,
              ]}
            >
              ↻
            </BtnOutline>
          </button>
          <button
            css={styles.nobtn}
            onClick={() => {
              verifyGuess();
            }}
          >
            <BtnOutline style={styles.btn}>Enter</BtnOutline>
          </button>
        </div>
      </div>

      <div css={styles.right}>
        <div css={styles.score}>
          <h3>{getScore()}</h3>
        </div>
        <div css={styles.card}>
          <div css={styles.cardContent}>
            <div>
              <p>
                You have found {state.correct.length} word
                {state.correct.length === 1 ? "" : "s"} out of{" "}
                {state.game.words.length}.
              </p>
              {state.correct.map((word) => (
                <p key={word}>{word.toUpperCase()}</p>
              ))}
            </div>
            <p css={styles.footer}>
              Source:{" "}
              <a target="_blank" href={state.game.source}>
                {state.game.source}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getLetter() {
  return String.fromCharCode("a".charCodeAt(0) + rand(0, 25));
}

// TODO: enforce minimum # of vowels
function getLetters(n: number) {
  let letters = "";
  let char = getLetter();
  for (let i = 0; i < n; ++i) {
    while (letters.includes(char)) {
      char = getLetter();
    }

    letters = letters.concat(char);
  }

  return letters;
}

// Where letters[0] is must have letter
// TODO: dynamic filename
async function getWords(filename: string): Promise<GameState["game"]> {
  const res = await fetch(filename);
  const obj: { data: string; credits: string } = await res.json();
  const words = obj.data;

  const lts = getLetters(7);
  const re = new RegExp(`\\b[${lts}]+\\b`, "gi");
  const found = words.match(re);

  //@ts-ignore
  let valid = [...new Set(found)];
  valid = valid.filter((word) => word.length > 3 && word.includes(lts[0]));

  // console.log(`${lts[0].toUpperCase()}, ${lts.slice(1)}`)
  // console.log(valid);

  return { letters: lts, words: valid, source: obj.credits };
}