import "./form.css";
import { useNavigate } from "react-router-dom";

const Register_Form = ({ setUser }) => {
  const navigate = useNavigate();

  return (
    <div className="login">
      <form action="">
        <div className="labs">
          <label>Identifiant</label>
          <input type="text" name="email" placeholder="E-mail adress"></input>
        </div>
        <div className="labs">
          <label>Mot de passe</label>

          <input type="password" name="password" placeholder="Password"></input>
        </div>

        <div className="redirect">
          <div>
            <p>Vous avez déjà un compte ?</p>
            <button onClick={() => navigate("/login")}>Se connecter</button>
          </div>

          <button className="l-but" type="submit">
            Créer →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register_Form;
