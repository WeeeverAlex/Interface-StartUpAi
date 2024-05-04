import React, { useState } from "react";
import { Link } from "react-router-dom";
import userLogo from "./assets/user.png";
import "./Home.css";
import ClearIcon from '@mui/icons-material/Clear';

function Home() {
    const [showPopUp, setShowPopUp] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [conversations, setConversations] = useState([
        { id: 1, name: "Conversa 1" },
        { id: 2, name: "Conversa 2" },
        { id: 3, name: "Conversa 3" }
    ]);

    const removeConversation = (id) => {
        setConversations(conversations.filter(conversation => conversation.id !== id));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowModal(false);
    };

    return (
        <div className="home">
            <div className="user" onClick={() => setShowPopUp(!showPopUp)}>
                <img src={userLogo} alt="User" />
            </div>
            <div className={`pop-up ${showPopUp ? 'active' : ''}`}>
                <p>%nome da pessoa%</p>
                <Link to="/" id="exit-button">
                    Sair
                </Link>
            </div>

            <div className="header">
                <div className="introduction">
                    <h1>Olá, %nome da pessoa%!</h1>
                    <p>
                        Para iniciar uma nova sessão, clique no botão abaixo.
                    </p>
                </div>

                <div className="new-conversation">
                    <button onClick={() => setShowModal(true)}>Nova conversa</button>
                </div>
            </div>

            <div className="prev-conversations">
                <div className="vertical-bar">
                    <div className="conversation">
                        <h2>Conversas anteriores</h2>
                        <div className="conversation-list">
                            <ul>
                                {conversations.map((conversation) => (
                                    <li key={conversation.id} className="conversa">
                                        {conversation.name}
                                        <ClearIcon className="clear" onClick={() => removeConversation(conversation.id)}/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-title">
                            <h2>Criar nova sessão</h2>
                            <ClearIcon className="clear" onClick={() => setShowModal(false)}/>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Nome da sessão:
                            </label>
                            <br></br>
                            <input type="text" required className="session-name"
                                      placeholder="Digite o nome da sessão..."/>

                            <br/><br/>

                            <label>
                                Currículo (upload):
                            </label>
                            <br></br>
                            <input type="file" required className="curriculo"/>

                            <br/><br/>

                            <label>
                                Descrição da Vaga:
                            </label>
                            <br></br>
                            <textarea required className="description"></textarea>

                            <br/><br/>

                            <button type="submit">Criar sessão</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
