import "./form.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useState } from "react";
import { loginRoute } from "../../utils/APIRoutes";

const Login_Form = ({ setUser }) => {
  const navigate = useNavigate();
  const [complet, setComplet]= useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 6000,
    transition: Slide,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const login = async (event) => {
    // fonction a appeler quand l'user clique sur "connexion"
    event.preventDefault();

    const response = await axios.post(loginRoute, {
      values,
    });
    const data = response.data;
    const u = response.data.uti;

    console.log(data);

    if (data.status === "ok") {
      // compte crée, on redirige sur la page de connexion.
      toast.success("You are connected !", toastOptions);

      localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, u.mail);
      // Redirige vers la page d'accueil -> récupère les informations de l'user et le set au niveau du dessus
     if (complet){
      navigate("/");
     }else {
      navigate("/multiform")
     }
      window.location.reload();
    } else {
      console.log("toast");
      toast.error("Informations incorrectes", toastOptions);
    }
  };

  return (
    <div className="login">
      <form action="" onSubmit={login}>
        <p className="reponsive-back" onClick={() => navigate("/")}>
          <i className="fa fa-arrow-left"></i> Back
        </p>
        <div className="labs">
          <label>Identifiant</label>
          <input
            type="text"
            name="identifiant"
            placeholder="Identifiant"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            required="required"
          ></input>
        </div>
        <div className="labs">
          <label>Mot de passe</label>

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            required="required"
          ></input>
        </div>

        <button
          className="l-but"
          type="submit"
          // onClick={() =>
          //   setUser({

          //   }
          //     )
          // }
        >
          Connexion →
        </button>

        <div className="redirect">
          <div>
            <p>Vous n'avez pas encore de compte ?</p>
            <button onClick={() => navigate("/register")}>
              Créer un compte
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login_Form;
