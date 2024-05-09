import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import userLogo from "./assets/user.png";
import "./Home.css";
import ClearIcon from "@mui/icons-material/Clear";

function Home() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, name: "Sessão 1" },
    { id: 2, name: "Sessão 2" },
    { id: 3, name: "Sessão 3" },
  ]);
  const [uploadedFile, setUploadedFile] = useState<Blob | null>(null);

  const sessionNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sessionNameRef.current || !descriptionRef.current) {
      console.error("Form refs are not available");
      return;
    }

    const formData = new FormData();
    formData.append("vaga", sessionNameRef.current.value);
    formData.append("descricao", descriptionRef.current.value);
    if (uploadedFile) {
      formData.append("file", uploadedFile); 
    }

    fetch("http://127.0.0.1:8000/entrevistas/perguntas", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

    setShowModal(false);
    setUploadedFile(null);
    event.currentTarget.reset();
  };

  return (
    <div className="home">
      <div className="user" onClick={() => setShowPopUp(!showPopUp)}>
        <img src={userLogo} alt="User" />
      </div>
      <div className={`pop-up ${showPopUp ? "active" : ""}`}>
        <p>%nome da pessoa%</p>
        <Link to="/" id="exit-button">
          Sair
        </Link>
      </div>

      <div className="header">
        <div className="introduction">
          <h1>Olá, %nome da pessoa%!</h1>
          <p>Para iniciar uma nova sessão, clique no botão abaixo.</p>
        </div>

        <div className="new-conversation">
          <button onClick={() => setShowModal(true)}>Nova conversa</button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-title">
              <h2>Criar nova sessão</h2>
              <ClearIcon
                className="clear"
                onClick={() => setShowModal(false)}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <label>Nome da sessão:</label>
              <br />
              <input
                type="text"
                required
                className="session-name"
                placeholder="Digite o nome da sessão..."
                ref={sessionNameRef}
              />
              <br />
              <br />

              <label>Currículo (upload):</label>
              <br />
              <input
                type="file"
                required
                className="curriculo"
                onChange={handleFileChange}
                accept="application/pdf"
              />
              <br />
              <br />

              <label>Descrição da Vaga:</label>
              <br />
              <textarea
                required
                className="description"
                ref={descriptionRef}
              ></textarea>
              <br />
              <br />

              <button type="submit">Criar sessão</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
