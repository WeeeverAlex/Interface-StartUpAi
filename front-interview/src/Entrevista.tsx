import { SetStateAction, useState } from 'react';
import './Entrevista.css';
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
        setPositiveFeedback('Pontos fortes da sua resposta');
        setImprovementFeedback('Pontos fracos na sua resposta');
        setIsSubmitted(true); // muda o estado para true quando o formulário é enviado
    };

    return (
        <><div className="interview">
            <Link to="/home"><button className="back-button">Voltar para a página inicial</button></Link>
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
            {isSubmitted && ( 
                <div className="feedback-container">
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