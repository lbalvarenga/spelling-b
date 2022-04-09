/** @jsxImportSource @emotion/react */
import { css, Interpolation, SerializedStyles, Theme } from "@emotion/react";

import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Btn, { BtnOutline } from "../components/Btn";
import Colored from "../components/Colored";
import Hive from "../components/Hive";

type GameState = {
  game: {
    letters: string;
    words: string[];
    source?: string;
  };
  guess: string;
  correct: { str: string; color: string }[];
  timeout: ReturnType<typeof setTimeout> | undefined;
};

const theme = {
  accent: "#F7DA43",
};

// TODO: cleanup code
// TODO: add points calculation system
// TODO: press button visually when typing with kbd
function Game() {
  const styles = {
    container: css`
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      text-align: center;

      @media (max-width: 1000px) {
        flex-direction: column-reverse;
      }
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
      max-width: 100%;
      height: 100%;
      width: 100%;
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
      height: 100%;
      width: 100%;

      overflow-x: hidden;

      border: 1px solid #dddddd;
      border-radius: 10px;
      text-align: left;

      overflow-y: auto;
      white-space: nowrap;
      text-overflow: ellipsis;

      padding: 20px;
      padding-top: 0;

      @media (max-width: 1000px) {
        height: 150px;
      }
    `,

    btn: css`
      &:hover {
        transform: none;
      }

      &:active {
        transform: scale(0.95);
      }

      margin: 0;

      @media (max-width: 1000px) {
        padding: 15px 20px;
        width: auto;
      }
    `,

    score: css`
      display: flex;
      text-align: left;
      align-items: center;
      margin: 10px 10px;
      margin-bottom: 0;
      justify-content: space-between;

      h3 {
        margin: 0;
        padding: 0;
      }
    `,

    wordArray: css`
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-content: flex-start;
      column-gap: 20px;

      p {
        margin-bottom: 0;
      }
    `,

    correctWord: css`
      margin-bottom: 0;
      text-decoration: underline;
      text-decoration-color: #bbbbbb;
      text-decoration-thickness: 2px;
    `,

    // TODO: make ellipsis work
    footer: css`
      width: 100%;
      margin-bottom: 0;
    `,

    refresh: css`
      background: none;
      border: none;

      &:hover {
        cursor: pointer;
      }
    `,

    reveal: css`
      background: none;
      border: none;

      &:hover {
        cursor: pointer;
      }
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
    timeout: undefined,
  });
  const stateRef = useRef(state);
  const setState = (data: GameState) => {
    stateRef.current = data;
    _setState(data);
  };

  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

  const [customStyle, setCustomStyle] = useState<{
    input: SerializedStyles;
  }>();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function setup(letters: string) {
      let game = await getWords("/words_webster.json", letters);
      while (game.words.length < 10) {
        letters = getLetters(7);
        game = await getWords("/words_webster.json", letters);
      }

      navigate(`/play/${letters}`);

      console.log(`${game.letters[0].toUpperCase()}, ${game.letters.slice(1)}`);
      console.log(game.words);
      setState({
        ...stateRef.current,
        game: game,
        correct: [],
        guess: "",
      });
    }

    const li = location.pathname.lastIndexOf("/");
    const path = location.pathname.slice(li + 1);

    let letters = path;

    const re = /^[a-z]{7}$/g;
    if (!re.test(path)) {
      letters = getLetters(7);
    }

    setup(letters);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
    };
  });

  function handleKeys(event: KeyboardEvent) {
    // Remove potential button focus
    // @ts-ignore
    document.activeElement.blur();

    // Cancels shake animation if running
    const sr = stateRef.current;
    if (sr.timeout) {
      clearTimeout(sr.timeout);
      clearGuess();
      setState({ ...sr, guess: "", timeout: undefined });
    }

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

  function sortCorrect() {
    const sr = stateRef.current;
    if (!sr.correct) return;

    const a = new Array(...sr.correct);
    console.log(a);

    a.sort((a, b) => {
      return a.str.charCodeAt(0) - b.str.charCodeAt(0);
    });

    console.log(a);
    return a;
  }

  function correctSort(a: any, b: any) {
    const aa = a.str.toLowerCase();
    const bb = b.str.toLowerCase();
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  }

  function correctIncludes(word: string) {
    const sr = stateRef.current;

    let contains = false;
    sr.correct.forEach((c) => {
      if (c.str === word) contains = true;
    });

    return contains;
  }

  function verifyGuess() {
    const sr = stateRef.current;
    if (!sr.guess || !sr.game) return;

    // setState({ ...state, guess: "" });
    if (sr.game.words.includes(sr.guess) && !correctIncludes(sr.guess)) {
      setState({
        ...sr,
        correct: [...sr.correct, { str: sr.guess, color: "null" }].sort(
          correctSort
        ),
        guess: "",
      });
    }

    // TODO: wiggle animation, smooth fade out
    else {
      setCustomStyle({
        ...customStyle,
        input: css`
          ${shakeAnim}
          -webkit-animation: shake-bottom 0.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
          animation: shake-bottom 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955)
            both;
        `,
      });

      setState({ ...stateRef.current, timeout: setTimeout(clearGuess, 550) });
    }
  }

  function backspaceGuess() {
    setState({
      ...stateRef.current,
      guess: stateRef.current.guess.slice(0, -1),
    });
  }

  function concatGuess(char: string) {
    // Cancels shake animation if running
    const sr = stateRef.current;
    if (sr.timeout) {
      clearTimeout(sr.timeout);
      clearGuess();
      setState({ ...sr, guess: "", timeout: undefined });
    }

    setState({
      ...stateRef.current,
      guess: stateRef.current.guess.concat(char.toLowerCase()),
    });
  }

  function clearGuess() {
    const sr = stateRef.current;

    setState({ ...sr, guess: "" });
    setCustomStyle({
      ...customStyle,
      input: css``,
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
            style={customStyle?.input}
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
                  width: 50px !important;
                  padding-left: 10px !important;
                  padding-right: 10px !important;
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
          <div>
            <button
              css={styles.reveal}
              onClick={() => {
                const all: { str: string; color: string }[] = [];
                state.game.words.forEach((word) => {
                  if (!correctIncludes(word)) {
                    all.push({ str: word, color: "red" });
                  }
                });
                setState({
                  ...state,
                  correct: [...state.correct, ...all].sort(correctSort),
                });
              }}
            >
              <Btn>Reveal</Btn>
            </button>
            <button
              css={styles.refresh}
              onClick={() => {
                navigate("/play");
                window.location.reload();
              }}
            >
              <BtnOutline
                style={css`
                  margin: 0;
                  width: 50px !important;
                  padding-left: 10px !important;
                  padding-right: 10px !important;
                `}
              >
                ↻
              </BtnOutline>
            </button>
          </div>
        </div>
        <div css={styles.card}>
          <div css={styles.cardContent}>
            <div css={styles.wordArray}>
              <p
                css={css`
                  width: 100%;
                `}
              >
                You have found {state.correct.length} word
                {state.correct.length === 1 ? "" : "s"} out of{" "}
                {state.game.words.length}.
              </p>
              {state.correct.map((word) => {
                return (
                  <p
                    key={word.str}
                    css={[
                      styles.correctWord,
                      css`
                        color: ${word.color};
                        text-decoration-color: ${word.color};
                      `,
                    ]}
                  >
                    {word.str.toUpperCase()}
                  </p>
                );
              })}
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

  // ...
  return letters[0].concat(letters.slice(1).split("").sort().join(""));
}

// Where letters[0] is must have letter
async function getWords(
  filename: string,
  letters: string
): Promise<GameState["game"]> {
  const res = await fetch(filename);
  const obj: { data: string; credits: string } = await res.json();
  const words = obj.data;

  const re = new RegExp(`\\b[${letters}]+\\b`, "gi");
  const found = words.match(re);

  //@ts-ignore
  let valid = [...new Set(found)];
  valid = valid.filter((word) => word.length > 3 && word.includes(letters[0]));

  return { letters: letters, words: valid, source: obj.credits };
}

const shakeAnim = `
/* ----------------------------------------------
 * Generated by Animista on 2022-4-3 18:4:33
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation shake-bottom
 * ----------------------------------------
 */
@-webkit-keyframes shake-bottom {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
  }
  10% {
    -webkit-transform: rotate(2deg);
            transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
            transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
            transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
            transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
            transform: rotate(2deg);
  }
}
@keyframes shake-bottom {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
  }
  10% {
    -webkit-transform: rotate(2deg);
            transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
            transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
            transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
            transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
            transform: rotate(2deg);
  }
}`;
