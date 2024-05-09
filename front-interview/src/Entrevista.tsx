import { useState, useEffect, useCallback  } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Entrevista.css";
import microphoneIcon from './assets/microfone.png';
import recordingIcon from './assets/recording.png';

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
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (location.state && 'questions' in location.state) {
      let questions = location.state.questions;
      if (typeof questions === 'string') {
        questions = JSON.parse(questions);
      }
      const questionArray = Object.entries(questions).map(([key, value], index) => ({
        id: index + 1,
        question: value,
      }));
      setQuestions(questionArray);
    }
  }, [location.state]);


  useEffect(() => {
    // Resetar o índice da pergunta quando as perguntas são atualizadas
    setCurrentQuestionIndex(0);
  }, [questions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex]?.id]: event.target.value,
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
    const newFeedbacks = questions.map((question) => ({
      question: question.question,
      answer: answers[question.id],
      positiveFeedback: `Pontos fortes da sua resposta a "${question.question}"`,
      improvementFeedback: `Pontos a melhorar na sua resposta a "${question.question}"`,
    }));
    setFeedbacks(newFeedbacks);
  };

  const [isRecording, setIsRecording] = useState(false);

    const startRecording = useCallback(() => {
    setIsRecording(true);
    }, []);

    const stopRecording = useCallback(() => {
    setIsRecording(false);
    }, []);

  return (
    <>
      <div className="interview">
        <Link to="/home">
          <button className="back-button">Voltar para a página inicial</button>
        </Link>
      </div>
      {!isCompleted ? (
        questions.length > 0 && (  // Adicionado verificação para garantir que as questões estão carregadas
          <div className="interview-container">
            <div className="interview-question">
              <span>Pergunta {questions[currentQuestionIndex].id}</span>
              <p>{questions[currentQuestionIndex].question}</p>
            </div>
            <div className="interview-answer">
              <textarea
                value={answers[questions[currentQuestionIndex].id] || ""}
                onChange={handleInputChange}
                placeholder="Escreva sua resposta aqui..."
              />
            <button onClick={isRecording ? stopRecording : startRecording} className="microfone-button">
                <img src={isRecording ? recordingIcon : microphoneIcon} alt="Microfone" />
                    {isRecording}
            </button>
              <button
                onClick={handleSubmit}
                disabled={!answers[questions[currentQuestionIndex]?.id]}
                className={!answers[questions[currentQuestionIndex]?.id] ? "button-disabled" : ""}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finalizar entrevista" : "Próxima"}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="feedback-summary">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-container">
              <h3>{feedback.question}</h3>
              <div className="feedback-positive">
                <p>{feedback.positiveFeedback}</p>
              </div>
              <div className="feedback-improvement">
                <p>{feedback.improvementFeedback}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Entrevista;