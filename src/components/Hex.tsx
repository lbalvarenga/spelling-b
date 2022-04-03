/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from "@emotion/react";

import React from "react";

type HexProps = {
  children?: React.ReactNode;
  style?: Interpolation<Theme>;
  onClick?: () => void;
};

function Hex(props: HexProps) {
  const styles = {
    hex: css`
      fill: #dddddd;
    `
  }

  return (
    <svg width="50%" viewBox="0 0 723 625" css={props.style}>
      <a href="#" onClick={props.onClick}>
        <polygon css={styles.hex} points="723,314 543,625.769145 183,625.769145 3,314 183,2.230855 543,2.230855 723,314" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
          {props.children}
        </text>
      </a>
    </svg>
  );
}

export default Hex;
