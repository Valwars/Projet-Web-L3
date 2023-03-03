import Register_Form from "../components/Formulaires/Register-form";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="left">
        <header>
          <i class="fas fa-hand-holding-heart"></i>
        </header>
        <main>
          <h1>Sparkly,</h1>
          <h1 className="bigtitle">Créer un compte.</h1>
          <p className="resume">
            Créer votre compte pour rencontrer de nouvelles personnes et peut
            être trouver votre grand amour !
          </p>
          <button onClick={() => navigate("/")}>
            Revenir a la page d'accueil →
          </button>
        </main>
      </div>
      <div className="form-container">
        <Register_Form></Register_Form>
      </div>
    </div>
  );
};

export default Register;
