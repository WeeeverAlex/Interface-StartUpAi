import React from "react";
import { Link } from "react-router-dom";
import './Login.css';

function LoginPage(){

    return(
        <div className="login">
            <div className="App-login" id="login">
                <h1>Fazer login</h1>
                <form>
                    <input type="email" placeholder="E-mail" required />
                    <input type="password" placeholder="Senha" required />
                    <button type="submit">Entrar</button>
                </form>
                <p>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
            </div>
        </div>
    );

}

export default LoginPage;