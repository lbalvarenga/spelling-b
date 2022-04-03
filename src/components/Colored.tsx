/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from "@emotion/react";

import React from "react";

const theme = {
  accent: "#F7DA43",
};

type ColoredProps = {
  style?: Interpolation<Theme>;
  highlight: string;
  word?: string;
  placeholder?: string;
};

function Colored(props: ColoredProps) {
  function colorify(str: string, char: string) {
    const res: { str: string; color: boolean }[] = [];
    let chars = "";
    let col = false;
    let i = 0;

    // TODO: my brain is fried, is this even good?
    while (i < str.length) {
      if (str[i] === char) {
        col = true;
        while (str[i] === char && i < str.length) {
          chars += str[i];
          ++i;
        }
      } else {
        col = false;
        while (str[i] !== char && i < str.length) {
          chars += str[i];
          ++i;
        }
      }

      res.push({ str: chars, color: col });
      chars = "";
    }

    return res;
  }

  return (
    <div css={props.style}>
      {props.word ? (
        // TODO: this code looks awful
        <h1>
          {colorify(props.word, props.highlight).map((text, index) => {
            return (
              <>
                {text.color ? (
                  <span
                    key={index}
                    css={css`
                      color: ${theme.accent};
                    `}
                  >
                    {text.str.toUpperCase()}
                  </span>
                ) : (
                  text.str.toUpperCase()
                )}
              </>
            );
          })}
        </h1>
      ) : (
        <h1
          css={css`
            color: #bbbbbb;
          `}
        >
          {props.placeholder}
        </h1>
      )}
    </div>
  );
}

export default Colored;
