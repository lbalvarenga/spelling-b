/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Btn, { BtnOutline } from "../components/Btn";
import Colored from "../components/Colored";
import Hive from "../components/Hive";
import ShakeAnim from "../components/ShakeAnim";

import Game from "../components/GameLogic";

const theme = {
  accent: "#F7DA43",
};

const dicts = [
  {
    name: "Webster Complete",
    url: "/words_webster.json",
  },
  {
    name: "Large Dictionary",
    url: "/words_large.json",
  },
  {
    name: "10000 Most Common",
    url: "/words_google.json",
  },
];

// TODO: cleanup code
// TODO: add points calculation system
// TODO: press button visually when typing with kbd
function GameView() {
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

    btnRound: css`
      width: 50px !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
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

    dicts: css`
      text-decoration: underline;
      font-size: inherit;
      border: none;

      cursor: pointer;

      &:focus {
        outline: none;
      }
    `,
  };

  const [state, _setState] = useState<Game.StateType>({
    game: {
      letters: "",
      words: [],
      dict: {
        name: "",
        url: "",
      },
    },
    correct: [],
    guess: "",
    timeout: undefined,
  });
  const stateRef = useRef(state);
  const setState = (data: Game.StateType) => {
    stateRef.current = data;
    _setState(data);
  };

  const [customStyle, setCustomStyle] = useState<{
    input: SerializedStyles;
  }>();

  const location = useLocation();
  const navigate = useNavigate();

  async function setup(letters: string, dict: { name: string; url: string }) {
    const sr = stateRef.current;

    let game = await Game.getWords(dict, letters);
    while (game.words.length < 10) {
      letters = Game.getLetters(7);
      game = await Game.getWords(dict, letters);
    }

    navigate(`/play/${letters}`);

    console.log(`${game.letters[0].toUpperCase()}, ${game.letters.slice(1)}`);
    console.log(game.words);
    setState({
      ...sr,
      game: game,
      correct: [],
      guess: "",
    });
  }

  useEffect(() => {
    const li = location.pathname.lastIndexOf("/");
    const path = location.pathname.slice(li + 1);

    let letters = path;

    const re = /^[a-z]{7}$/g;
    if (!re.test(path)) {
      letters = Game.getLetters(7);
    }

    setup(letters, dicts[0]);
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
          ${ShakeAnim}
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

  function changeDict(index: number) {
    const sr = stateRef.current;
    setup(sr.game.letters, dicts[index]);
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
            <BtnOutline style={[styles.btn, styles.btnRound]}>↻</BtnOutline>
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
          <h3>{Game.getScore(stateRef.current)}</h3>
          <div>
            <button
              css={styles.reveal}
              onClick={() => {
                const all: Game.CorrectType = [];
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
                      `,
                    ]}
                  >
                    {word.str.toUpperCase()}
                  </p>
                );
              })}
            </div>
            <p css={styles.footer}>
              Dictionary: &nbsp;
              <select
                css={styles.dicts}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  changeDict(Number(event.target.value));
                }}
              >
                {dicts.map((dict, index) => (
                  <option value={index}>{dict.name}</option>
                ))}
              </select>
              <a
                href={state.game.source}
                css={css`
                  float: right;
                `}
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameView;
