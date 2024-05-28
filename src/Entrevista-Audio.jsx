import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./Entrevista.css";
import microphoneIcon from './assets/microfone.png';
import recordingIcon from './assets/recording.png';
import icon from "./assets/favicon.ico";

const Entrevista_Audio = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [message, setMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [open, setOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && 'questions' in location.state) {
      let questions = location.state.questions;
      if (typeof questions === 'string') {
        questions = JSON.parse(questions);
      }
      if (questions && typeof questions === 'object') {
        const questionArray = Object.entries(questions).map(([key, value], index) => ({
          id: index + 1,
          question: value,
        }));
        setQuestions(questionArray);
      } else {
        navigate("/home");
      }
    } else {
      console.error('Location state is invalid or missing');
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [questions]);

  const handleSubmit = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      generateFeedback();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.wav');
          const response = await fetch('https://api.pontochave.projetohorizontes.com/entrevistas/audio', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload audio file.');
          }

          const data = await response.json();
          const transcription = data || "Transcrição não disponível";

          setAnswers(prevAnswers => {
            const newAnswers = {
              ...prevAnswers,
              ["resposta" + (currentQuestionIndex + 1)]: transcription
            };

            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
              setIsCompleted(true);
              generateFeedback(newAnswers);
            }

            return newAnswers;
          });

          setMessage("Gravação bem-sucedida!");
          setAlertSeverity("success");
          setOpen(true);

        } catch (error) {
          console.error('Error uploading audio file:', error);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      setMessage("Gravação iniciada.");
      setAlertSeverity("info");
      setOpen(true);

    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const generateFeedback = (finalAnswers = answers) => {
    setIsLoading(true);
    const entrevistaId = localStorage.getItem('entrevista_id') || "";

    const formData = new FormData();
    formData.append('entrevista_id', entrevistaId);
    formData.append('link_audio', JSON.stringify(finalAnswers));

    fetch("https://api.pontochave.projetohorizontes.com/entrevistas/respostas", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      data = JSON.parse(data);
      const feedbackFormatado = questions.map((question, index) => {
        const key = `resposta${index + 1}`;
        return {
          question: question.question,
          answer: finalAnswers[key] || "Nenhuma resposta fornecida.",
          positiveFeedback: data.pontos_fortes[key] || "Nenhum feedback positivo fornecido.",
          improvementFeedback: data.pontos_fracos[key] || "Nenhum ponto de melhoria identificado."
        };
      });

      setIsLoading(false);
      setFeedbacks(feedbackFormatado);
    })
    .catch(error => {
      console.error("Error:", error);
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

    setMessage("Gravação parada.");
    setAlertSeverity("info");
    setOpen(true);
  };

  document.title = "Ponto Chave";

  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = icon;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="interview">
        <Link to="/home">
          <button className="back-button">Voltar para a página inicial</button>
        </Link>
      </div>
      {!isCompleted ? (
        questions.length > 0 && (
          <div className="interview-container">
            <div className="interview-question">
              <span>Pergunta {questions[currentQuestionIndex].id}</span>
              <p>{questions[currentQuestionIndex].question}</p>
            </div>
            <div className="interview-answer">
              <div className="audio-answer">
                <button onClick={isRecording ? stopRecording : startRecording} className="microfone-button">
                  <img src={isRecording ? recordingIcon : microphoneIcon} alt="Microfone" />
                  {isRecording ? "" : ""}
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!answers["resposta" + questions[currentQuestionIndex].id]}
                className={!answers["resposta" + questions[currentQuestionIndex].id] ? "button-disabled" : "next-button"}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finalizar entrevista" : "Próxima"}
              </button>
            </div>
          </div>
        )
      ) : (
        isLoading && (
          <div className="loading-screen">
            <p>Carregando feedback...</p>
          </div>
        )
      )}
      <div className="feedback-summary">
        {feedbacks.map((feedback, index) => (
          <div key={index} className="feedback-container">
            <h3>{feedback.question}</h3>
            <div className="feedback-answer">
              <strong>Resposta fornecida:</strong> {feedback.answer}
              <br /><br />
            </div>
            <div className="feedback-positive">
              <strong style={{color : "#2b5c30", paddingLeft: "10px", fontSize: "1.2em"}}>
                Pontos fortes
              </strong>
              <p>{feedback.positiveFeedback}</p>
            </div>
            <div className="feedback-improvement">
              <strong style={{color : "#b22222", paddingLeft: "10px", fontSize: "1.2em"}}>
                Pontos a melhorar
              </strong>
              <p>{feedback.improvementFeedback}</p>
            </div>
          </div>
        ))}
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Entrevista_Audio;
