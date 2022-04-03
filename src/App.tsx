/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// TODO: create theme reducer + dark theme

function App() {
  const styles = {
    container: css`
      display: flex;
      width: 100%;
      height: 100%;
    `,
    app: css`
      body,
      html,
      #root {
        margin: 0;
        padding: 0;

        overflow: hidden;
        width: 100vw;
        height: 100vh;
      }

      * {
        box-sizing: border-box;
        font-family: "Libre Franklin", sans-serif;
      }
    `,
  };

  // TODO: more elegant solution
  const location = useLocation();
  if (location.pathname === "/") {
    return <Navigate to="/home" />;
  }

  return (
    <div css={styles.container}>
      <Global styles={styles.app} />
      <Outlet />
    </div>
  );
}

export default App;
