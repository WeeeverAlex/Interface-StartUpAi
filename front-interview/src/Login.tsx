import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./Login.css";

function LoginPage() {
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
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      const response = await fetch('http://127.0.0.1:8000/user/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${email}&password=${password}`
      });
  
      if (!response.ok) {
        throw new Error('Credenciais inválidas!');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      // Mensagem de sucesso aqui
      setMessage("Login bem-sucedido!");
      setAlertSeverity('success');  // Definir a severidade para sucesso
      setOpen(true);  // Abrir o Snackbar
  
      fetch("http://127.0.0.1:8000/user/me", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('user_id', JSON.stringify(data.id));
        localStorage.setItem('name', data.name);
      })
  
      setTimeout(() => navigate("/home"), 2000);  // Reduzir o tempo de espera para navegação
    } catch (error) {
      setMessage("Erro: " + error.message);
      setAlertSeverity('error');  // Definir a severidade para erro
      setOpen(true);  // Abrir o Snackbar
    }
  };

  return (
    <div className="login">
      <div className="App-login" id="login">
        <h1>Fazer login</h1>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="E-mail" required />
          <input name="password" type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
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
