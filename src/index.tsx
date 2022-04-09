import React from "react";
import * as ReactDOMClient from "react-dom/client";

import App from "./App";
import Home from "./pages/Home";
import GameView from "./pages/Game";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// TODO: remove root div?
const container: any = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="play" element={<GameView />} />
          <Route path="play/:id" element={<GameView />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
