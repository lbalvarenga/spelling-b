/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from "@emotion/react";

import React from "react";

type BtnProps = {
  children?: React.ReactNode;
  style?: Interpolation<Theme>;
};

function Btn(props: BtnProps) {
  const styles = {
    btn: css`
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
  };

  return <div css={[styles.btn, props.style]}>{props.children}</div>;
}

export function BtnOutline(props: BtnProps) {
  const styles = {
    btn: css`
      background-color: white;
      color: black;
      border: 1px solid black;
    `,
  };

  return <Btn style={[styles.btn, props.style]}>{props.children}</Btn>;
}

export default Btn;
