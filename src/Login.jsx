import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./Login.css";
import icon from "./assets/favicon.ico";

function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success"); // 'error' ou 'success'

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("https://api.pontochave.projetohorizontes.com/user/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${email}&password=${password}`,
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas!");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setMessage("Login bem-sucedido! Redirecionando...");
      setAlertSeverity("success");
      setOpen(true);

      fetch("https://api.pontochave.projetohorizontes.com/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user_id", JSON.stringify(data.id));
          localStorage.setItem("name", data.name);
        });

      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      setMessage("Erro: " + error.message);
      setAlertSeverity("error");
      setOpen(true);
    }
  };

  document.title = "Ponto Chave - Fazer Login";

  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = icon;

  return (
    <div className="login">
      <div className="App-login" id="login">
        <h1>Fazer login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input name="email" type="email" placeholder="Insira seu e-mail..." required />
          <label htmlFor="password">Senha</label>
          <input name="password" type="password" placeholder="Insira sua senha..." required />
          <button type="submit">Entrar</button>
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
          Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
