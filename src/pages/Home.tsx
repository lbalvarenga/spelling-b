/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React from "react";
import { Link } from "react-router-dom";

const theme = {
  accent: "#F7DA43",
};

// TODO: refactor buttons
// TODO: add loading screen
function Home() {
  const styles = {
    home: css`
      background-color: ${theme.accent};
      display: flex;
      align-items: center;
      justify-content: center;

      padding: 10px;
      width: 100%;
      height: 100%;

      text-align: center;
    `,

    content: css`
      max-width: 400px;
    `,

    logo: css`
      width: 75px;
      height: 75px;

      border-radius: 50px;
    `,

    title: css``,

    desc: css`
      font-weight: normal;
    `,

    btn: css`
      display: inline-block;
      text-decoration: none;
      color: white;
      background-color: black;
      padding: 15px 50px;
      border-radius: 50px;
      font-weight: bold;
      margin: 10px;
      width: 150px;

      transition: 0.2s ease-in-out;

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(1);
      }
    `,

    btnOutline: css`
      display: inline-block;
      text-decoration: none;
      color: black;
      padding: 15px 40px;
      border-radius: 50px;
      border: 1px solid black;
      font-weight: bold;
      margin: 10px;
      width: 150px;

      transition: 0.2s ease-in-out;

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(1);
      }
    `,

    date: css`
      margin-bottom: 0;
    `,

    credits: css`
      margin-top: 0px;
    `,
  };

  return (
    <div css={styles.home}>
      <div css={styles.content}>
        <img css={styles.logo} src="https://via.placeholder.com/500" />
        <h1 css={styles.title}>Spelling Bee</h1>
        <h2 css={styles.desc}>How many words can you make with 7 letters?</h2>
        <a
          css={styles.btnOutline}
          target="_blank"
          href="https://github.com/lukeathedev/spelling-b"
        >
          Source
        </a>
        <Link css={styles.btn} to="/play">
          Play
        </Link>
        <h3 css={styles.date}>Version Alpha</h3>
        <p css={styles.credits}>Created by Lucas Alvarenga</p>
      </div>
    </div>
  );
}

export default Home;
