import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import userLogo from "./assets/user.png";
import "./Home.css";
import ClearIcon from "@mui/icons-material/Clear";
import icon from "./assets/favicon.ico";

function Home() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sessionNameRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (event, interviewType) => {
    event.preventDefault();
    setLoading(true);

    if (!sessionNameRef.current || !descriptionRef.current) {
      console.error("Form refs are not available");
      return;
    }

    const userName = localStorage.getItem('name') || "";

    const formData = new FormData();
    formData.append("vaga", sessionNameRef.current.value);
    formData.append("link_descricao", descriptionRef.current.value);
    formData.append("user_id", localStorage.getItem('user_id') || "");
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }

    fetch("https://api.pontochave.projetohorizontes.com/entrevistas/perguntas", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem('entrevista_id', data[1]);
        console.log(localStorage.getItem('entrevista_id'));
        setTimeout(() => navigate(interviewType === "audio" ? "/entrevista_audio" : "/entrevista", { state: { questions: data[0] } }), 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  document.title = "Ponto Chave - Home";

  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = icon;

  return (
    <div className="home">
      <div className="user" onClick={() => setShowPopUp(!showPopUp)}>
        <img src={userLogo} alt="User" />
      </div>
      <div className={`pop-up ${showPopUp ? "active" : ""}`}>
        <p>{localStorage.getItem('name')}</p>
        <Link to="/" id="exit-button">
          Sair
        </Link>
      </div>

      <div className="header">
        <div className="introduction">
          <h1>Olá, <span>{localStorage.getItem('name')}</span></h1>
          <p>Para iniciar uma nova entrevista, clique no botão abaixo.</p>
        </div>

        <div className="new-conversation">
          <button onClick={() => setShowModal(true)}>Nova conversa</button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-title">
              <h2>Criar nova entrevista</h2>
              <ClearIcon
                className="clear"
                onClick={() => setShowModal(false)}
              />
            </div>
            <form>
              <label>Título da vaga:</label>
              <br />
              <input
                type="text"
                required
                className="session-name"
                placeholder="Digite o título da vaga..."
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
                accept=".pdf,.docx"
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
              <br />
              <br />

              <label>Descrição da Vaga:</label>
              <br />
              <textarea
                required
                className="description"
                ref={descriptionRef}
                placeholder="Escreva a descrição da vaga aqui..."
              ></textarea>
              <br />
              <br />

              <label>Tipo de Entrevista:</label>
              <br />
              <button type="submit" className="session-button" onClick={(e) => handleSubmit(e, "text")}>Entrevista por Escrito</button>
              <button type="submit" className="session-button" onClick={(e) => handleSubmit(e, "audio")}>Entrevista por Áudio</button>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <p>Carregando perguntas...</p>
        </div>
      )}
    </div>
  );
}

export default Home;
