import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Entrevista.css";
import icon from "./assets/favicon.ico";

const Entrevista = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleInputChange = (event) => {
    setAnswers({
      ...answers,
      ["resposta" + questions[currentQuestionIndex].id]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      generateFeedback();
    }
  };

  const generateFeedback = () => {
    setIsLoading(true);
    const entrevistaId = localStorage.getItem('entrevista_id') || "";

    const formData = new FormData();
    formData.append('entrevista_id', entrevistaId);
    formData.append('link_audio', JSON.stringify(answers));

    fetch("https://api.pontochave.projetohorizontes.com/entrevistas/respostas", {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        data = JSON.parse(data);
        const feedbackFormatado = questions.map((question, index) => {
          const key = `resposta${index + 1}`;
          const positiveFeedback = data.pontos_fortes[key] || "Nenhum feedback positivo fornecido.";
          const improvementFeedback = data.pontos_fracos[key] || "Nenhum ponto de melhoria identificado.";
          return {
            question: question.question,
            answer: answers[key] || "Nenhuma resposta fornecida.",
            positiveFeedback,
            improvementFeedback,
          };
        });

        setIsLoading(false);
        setFeedbacks(feedbackFormatado);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  document.title = "Ponto Chave";

  const favicon = document.querySelector('link[rel="icon"]');
  favicon.href = icon;

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
              <textarea
                value={answers["resposta" + questions[currentQuestionIndex].id] || ""}
                onChange={handleInputChange}
                placeholder="Escreva sua resposta aqui..."
              />
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
    </>
  );
};

export default Entrevista;
