import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import icon from "./assets/favicon.ico";
import InfoIcon from "@mui/icons-material/Info"; // Importar o ícone de informação

function Cadastro() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success"); // 'error' ou 'success'

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setAlertSeverity("error");
      setOpen(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      setMessage("Cadastro realizado com sucesso! Redirecionando...");
      setAlertSeverity("success");
      setOpen(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage("Erro: " + error.message);
      setAlertSeverity("error");
      setOpen(true);
    }
  };

  document.title = "Ponto Chave - Cadastro";

  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = icon;

  return (
    <div className="cadastro">
      <div className="App-cadastro" id="cadastro">
        <h1>Cadastrar</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nome completo</label>
          <input id="name" name="name" type="text" placeholder="Insira seu nome completo..." required />
          
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" placeholder="Insira seu e-mail..." required />

          <div id="password-label-and-info">
            <label htmlFor="password">Senha</label>
            <InfoIcon className="info-icon"
              onMouseOver={() => document.getElementById("password-info").style.visibility = "visible"}
              onMouseOut={() => document.getElementById("password-info").style.visibility = "hidden"}
              sx={{ cursor: 'help' }}
            />
            <div id="password-info" className="password-info" style={{ visibility: 'hidden' }}>
              <p>A senha deve conter:</p>
              <ul>
                <li>A senha deve ter pelo menos 8 caracteres.</li>
                <li>Pelo menos uma letra e um número.</li>
              </ul>
            </div>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Insira sua senha..."
            required
            autocomplete="off"
          />
          
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirme sua senha..."
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <p>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
