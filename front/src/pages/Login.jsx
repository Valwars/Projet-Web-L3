import LoginForm from "../components/Formulaires/Login-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="left">
        <header>
          <i class="fas fa-hand-holding-heart"></i>
        </header>
        <main>
          <h1>Sparkly,</h1>
          <h1 className="bigtitle">Connecter vous.</h1>
          <p className="resume">
            Une fois connecté vous aurez accès à toutes vos informations et a
            une interface dédié à la recherche de partenaire en ligne.
          </p>
          <button onClick={() => navigate("/")}>
            Revenir a la page d'accueil →
          </button>
        </main>
      </div>
      <div className="form-container">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default Login;
