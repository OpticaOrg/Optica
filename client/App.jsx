import "./stylesheets/styles.scss";
import React from "react";
import { MainPage } from "./features/mainPage/mainPageContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./features/loginPage/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
