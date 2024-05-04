import React from "react";
import { Link } from "react-router-dom";
import './Cadastro.css';

function Cadastro(){
    return(
        <div className="cadastro">
            <div className="App-cadastro" id="cadastro">
                <h1>Cadastrar</h1>
                <form>
                    <input type="text" placeholder="Nome completo" required />
                    <input type="email" placeholder="E-mail" required />
                    <input type="password" placeholder="Senha" required />
                    <input type="password" placeholder="Confirme sua senha" required />
                    <button type="submit">Cadastrar</button>
                </form>
                <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
            </div>
        </div>
    );
}

export default Cadastro;