import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./Login";
import Cadastro from "./Cadastro";
import Home from "./Home";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Cadastro />} />
        <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "20%", fontSize: "5rem"}}>404 - Page Not Found</h1>} />
        <Route path="/home" element={<Home />}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
