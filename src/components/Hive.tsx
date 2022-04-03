/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from "@emotion/react";

import React from "react";
import Hex from "./Hex";

const theme = {
  accent: "#F7DA43",
};

type HiveProps = {
  letters: string;
  callback: (char: string) => void;
  style?: Interpolation<Theme>;
};

function Hive(props: HiveProps) {
  const size = 90;
  const lts = props.letters.toUpperCase();

  const styles = {
    container: css`
      display: grid;
    `,
    hex: css`
      transition: 0.1s ease-in-out;

      &:active {
        transform: scale(0.9);
      }
      pointer-events: none;
      a {
        pointer-events: all;
      }

      text {
        font-size: 200px;
        font-weight: bold;
      }
      height: ${size}px;
      width: auto;
    `,

    main: css`
      polygon {
        fill: ${theme.accent};
      }
    `,

    top: css`
      z-index: 2;

      svg {
        &:nth-of-type(odd) {
          margin-bottom: -${size / 2}px;
        }

        &:nth-of-type(1) {
          margin-right: -20px;
        }

        &:nth-of-type(3) {
          margin-left: -20px;
        }

        &:nth-of-type(2) {
          margin-bottom: 3px;
        }
      }

      display: inline;
      white-space: nowrap;
    `,
    center: css`
      z-index: 1;
      display: flex;
      justify-content: center;
    `,
    bottom: css`
      z-index: 2;

      svg {
        &:nth-of-type(odd) {
          margin-top: -${size / 2 - 3}px;
        }

        &:nth-of-type(1) {
          margin-right: -20px;
        }

        &:nth-of-type(3) {
          margin-left: -20px;
        }

        // TODO: fix inconsistencies in sizing of hexagons
        &:nth-of-type(2) {
          margin-top: 7px;
        }
      }

      display: flex;
    `,
  };

  return (
    <div css={[styles.container, props.style]}>
      <div css={styles.top}>
        <Hex style={styles.hex} onClick={() => props.callback(lts[1])}>
          {lts[1]}
        </Hex>
        <Hex style={styles.hex} onClick={() => props.callback(lts[2])}>
          {lts[2]}
        </Hex>
        <Hex style={styles.hex} onClick={() => props.callback(lts[3])}>
          {lts[3]}
        </Hex>
      </div>
      <div css={styles.center}>
        <Hex
          style={[styles.hex, styles.main]}
          onClick={() => props.callback(lts[0])}
        >
          {lts[0]}
        </Hex>
      </div>
      <div css={styles.bottom}>
        <Hex style={styles.hex} onClick={() => props.callback(lts[4])}>
          {lts[4]}
        </Hex>
        <Hex style={styles.hex} onClick={() => props.callback(lts[5])}>
          {lts[5]}
        </Hex>
        <Hex style={styles.hex} onClick={() => props.callback(lts[6])}>
          {lts[6]}
        </Hex>
      </div>
    </div>
  );
}
export default Hive;
