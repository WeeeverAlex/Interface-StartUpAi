import { SetStateAction, useState } from 'react';
import './Entrevista.css';
import companyLogo from "./assets/logo.png";
import { Link } from "react-router-dom";

const Entrevista = () => {
    const [answer, setAnswer] = useState('');
    const [positiveFeedback, setPositiveFeedback] = useState(''); // feedback positivo
    const [improvementFeedback, setImprovementFeedback] = useState(''); // feedback a melhorar
    const [isSubmitted, setIsSubmitted] = useState(false); // estado para controlar a visibilidade dos quadrados de feedback

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = () => {
        console.log('Submitted answer:', answer); // Set feedback here based on the answer
        setPositiveFeedback('Feedback positivo para a resposta');
        setImprovementFeedback('Feedback a melhorar para a resposta');
        setIsSubmitted(true); // muda o estado para true quando o formulário é enviado
    };

    return (
        <><div className="landingPage">
            <nav className="navbar">
                <img src={companyLogo} alt="Aplauso Logo" className="navbar-logo" />
                <ul className="nav-links">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <Link to="/login" id="login-button">
                            Login
                        </Link>
                    </li>
                </ul>
            </nav>
        </div><div className="interview-container">
                <div className="interview-question">
                    <span>Conversa XX</span>
                    <p>Pergunta...?</p>
                </div>
                <div className="interview-answer">
                    <textarea
                        value={answer}
                        onChange={handleInputChange}
                        placeholder="Escreva sua resposta aqui." />
                    <button onClick={handleSubmit}>Enviar</button>
                </div>
            </div>
            {isSubmitted && ( // os quadrados de feedback só serão renderizados se isSubmitted for true
                <div className="feedback-container"> {/* Feedback container */}
                    <div className="feedback-box">
                        {positiveFeedback}
                    </div>
                    <div className="feedback-box-improvement">
                        {improvementFeedback}
                    </div>
                </div>
            )}
        </>
    );
}

export default Entrevista;