import "./form.css";
import { useNavigate } from "react-router-dom";
import { registerRoute } from "../../utils/APIRoutes";
import axios from "axios";
import { useState } from "react";

const Register_Form = ({ setUser }) => {
  const navigate = useNavigate();
  const [nouveau, setNouveau] = useState({
    pdp: "",
    photos: [],
    name: "",
    firstname: "",
    age: "",
    sexe: "",
    orientation: "",
    description: "",
    interests: [],
    localisation: "",
    identifiant: "",
    mdp: "",
  });
  const createuser = async () => {
    try {
    } catch (error) {}
  };

  return (
    <div className="login">
      <form action="" onSubmit={createuser}>
        <p className="reponsive-back" onClick={() => navigate("/")}>
          <i className="fa fa-arrow-left"></i> Back
        </p>
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
