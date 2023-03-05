import "./form.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useState } from "react";
import { loginRoute } from "../../utils/APIRoutes";

const Login_Form = ({ setUser }) => {
  const navigate = useNavigate();

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
    // fonction a appeler quand l'user clique sur "créer"
    event.preventDefault();

    const { email, password } = values;

    const { data } = await axios.post(loginRoute, {
      email,
      password,
    });

    if (data.status === "error") {
      toast.error(data.error, toastOptions);
    }
    if (data.status === "ok") {
      // compte crée, on redirige sur la page de connexion.

      toast.success("You are connected !", toastOptions);
      local_user(data);

      // Redirige vers la page d'accueil -> récupère les informations de l'user et le set au niveau du dessus
      setUser(data.user);
      //navigate('/Home')
    }
  };

  const local_user = (data) => {
    localStorage.setItem(
      process.env.REACT_APP_LOCALHOST_KEY,
      JSON.stringify(data.token)
    );
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <div className="login">
      <form action="" onSubmit={(event) => login(event)}>
        <div className="labs">
          <label>Adresse mail</label>
          <input
            type="text"
            name="email"
            placeholder="E-mail adress"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <div className="labs">
          <label>Mot de passe</label>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          ></input>
        </div>

        <div className="redirect">
          <div>
            <p>Vous n'avez pas encore de compte ?</p>
            <button onClick={() => navigate("/register")}>
              Créer un compte
            </button>
          </div>

          <button
            className="l-but"
            type="submit"
            onClick={() =>
              setUser({
                nom: "Merault",
                prenom: "Valentin",
                adress: "123 Rue des pavillons 81000 Albi France",
                matchs: [
                  {
                    id: "34",
                    nom: "Jane",
                    prenom: "Cooper",
                    pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
                  },
                  {
                    id: "33",
                    nom: "Janou",
                    prenom: "Lapinou",
                    pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
                  },
                ],
              })
            }
          >
            Connexion →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login_Form;
