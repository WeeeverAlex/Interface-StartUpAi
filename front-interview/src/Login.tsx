import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function LoginPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (event:any) => {
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
      setMessage("Login bem-sucedido!");
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

      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      setMessage("Erro: " + error.message);
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
        {message && <p className="message">{message}</p>}
        <p>
          Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
