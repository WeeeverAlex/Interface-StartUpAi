import { useState, useEffect } from "react";
import "./Entrevista.css";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  question: string;
}

interface Answers {
  [key: number]: string;
}

interface Feedback {
  question: string;
  answer: string;
  positiveFeedback: string;
  improvementFeedback: string;
}



const Entrevista = () => {
    
    
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/pergunta")
        .then((response) => response.json())
        .then((data) => setData(data));
    }, []);
    
    console.log(data);

  const questions: Question[] = [
    { id: 1, question: "Qual sua maior força?" },
    { id: 2, question: "Como você lida com pressão?" },
    { id: 3, question: "Qual foi um desafio recente e como você o superou?" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: event.target.value,
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
    const newFeedbacks: Feedback[] = questions.map((question) => ({
      question: question.question,
      answer: answers[question.id],
      positiveFeedback: `Pontos fortes da sua resposta a "${question.question}"`,
      improvementFeedback: `Pontos a melhorar na sua resposta a "${question.question}"`,
    }));
    setFeedbacks(newFeedbacks);
  };

  return (
    <>
      <div className="interview">
        <Link to="/home">
          <button className="back-button">Voltar para a página inicial</button>
        </Link>
      </div>
      {!isCompleted ? (
        <div className="interview-container">
          <div className="interview-question">
            <span>Conversa {questions[currentQuestionIndex].id}</span>
            <p>{questions[currentQuestionIndex].question}</p>
          </div>
          <div className="interview-answer">
            <textarea
              value={answers[questions[currentQuestionIndex].id] || ""}
              onChange={handleInputChange}
              placeholder="Escreva sua resposta aqui..."
            />
            <button
              onClick={handleSubmit}
              disabled={!answers[questions[currentQuestionIndex].id]}
              className={
                !answers[questions[currentQuestionIndex].id]
                  ? "button-disabled"
                  : ""
              }
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finalizar entrevista"
                : "Próxima"}
            </button>
          </div>
        </div>
      ) : (
        <div className="feedback-summary">
          {feedbacks.map((feedback) => (
            <div key={feedback.question} className="feedback-container">
              <h3>{feedback.question}</h3>
              <p>{feedback.positiveFeedback}</p>
              <p>{feedback.improvementFeedback}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Entrevista;
