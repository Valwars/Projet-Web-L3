import "./form.css";
import { useNavigate } from "react-router-dom";
import { registerRoute } from "../../utils/APIRoutes";
import { ToastContainer, toast, Slide } from "react-toastify";
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
    mail: "",
    mdp: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 6000,
    transition: Slide,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const createuser = async (event) => {
    event.preventDefault();
    console.log("tentative de création");
    try {
      const create = await axios.post(registerRoute, {
        nouveau,
      });

      const status = create.data.status;
      const id = create.data.id;

      if (status === "ok") {
        navigate("/login");
        toast.success("Utilisateur créé !", toastOptions);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login">
      <form action="" onSubmit={createuser}>
        <p className="reponsive-back" onClick={() => navigate("/")}>
          <i className="fa fa-arrow-left"></i> Back
        </p>
        <div className="labs">
          <label>Identifiant</label>
          <input
            type="email"
            name="email"
            placeholder="E-mail adress"
            value={nouveau.mail}
            onChange={(e) => setNouveau({ ...nouveau, mail: e.target.value })}
            required="required"
          />
        </div>
        <div className="labs">
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={nouveau.mdp}
            onChange={(e) => setNouveau({ ...nouveau, mdp: e.target.value })}
            required="required"
          />
        </div>

        <button className="l-but" type="submit">
          Créer →
        </button>

        <div className="redirect">
          <div>
            <p>Vous avez déjà un compte ?</p>
            <button onClick={() => navigate("/login")}>Se connecter</button>
          </div>
        </div>
      </form>{" "}
      <ToastContainer />
    </div>
  );
};

export default Register_Form;
