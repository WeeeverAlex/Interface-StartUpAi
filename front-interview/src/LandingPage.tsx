import companyLogo from "./assets/logo.png";
import jobPicture from "./assets/job-interview.jpg";
import step1 from "./assets/icon1.png";
import step2 from "./assets/icon2.png";
import step3 from "./assets/icon3.png";
import "./LandingPage.css";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landingPage">
      <nav className="navbar">
        <img src={companyLogo} alt="Aplauso Logo" className="navbar-logo" />
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">Sobre</a>
          </li>
          <li>
            <Link to="/login" id="login-button">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      <div className="App-header" id="home">
        <img src={jobPicture} alt="Job Interview" className="job-picture" />
        <h1>
          Bem-vindo à <strong>Aplauso</strong>
        </h1>
        <p>Prepare-se para sua próxima entrevista de emprego com confiança!</p>
      </div>

      <div className="App-about" id="about">
        <h2>Como vamos te ajudar?</h2>
        <div className="steps">
          <div className="step1">
            <img src={step1} alt="Step 1" className="step-picture" />
            <p>
              Você insere seu currículo e a descrição da vaga em que está
              interessado
            </p>
          </div>

          <span>&#8594;</span>

          <div className="step2">
            <img src={step2} alt="Step 2" className="step-picture" />
            <p>
              A Inteligência Artificial gera possíveis perguntas com base no seu
              currículo e na descrição da vaga
            </p>
            {/* flecha */}
          </div>

          <span>&#8594;</span>

          <div className="step3">
            <img src={step3} alt="Step 3" className="step-picture" />
            <p>
              Você pratica respondendo as perguntas e recebe feedbacks
              instantâneos para validar suas respostas
            </p>
          </div>
        </div>
      </div>

      <div className="separator"></div>

      <div className="start-now">
        <h2>Faça seu cadastro e comece a praticar agora mesmo!</h2>

        <Link to="/signup" id="signup-button">
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
