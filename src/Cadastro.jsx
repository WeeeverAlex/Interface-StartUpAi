import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cadastro.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import icon from './assets/favicon.ico';

function Cadastro() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // 'error' ou 'success'

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setAlertSeverity('error');
      setOpen(true);
      return;
    }

    try {
      const response = await fetch('https://api.pontochave.projetohorizontes.com/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        throw new Error('Falha no cadastro');
      }

      setMessage("Cadastro realizado com sucesso!");
      setAlertSeverity('success');
      setOpen(true);
      setTimeout(() => navigate("/login"), 2000);  // Redirect after 2 seconds
    } catch (error) {
      setMessage("Erro: " + error.message);
      setAlertSeverity('error');
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
          <input name="name" type="text" placeholder="Nome completo" required />
          <input name="email" type="email" placeholder="E-mail" required />
          <input name="password" type="password" placeholder="Senha" required />
          <input name="confirmPassword" type="password" placeholder="Confirme sua senha" required />
          <button type="submit">Cadastrar</button>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
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
