import "./form.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useState } from "react";
import { loginRoute } from "../../utils/APIRoutes";

const Login_Form = ({ setUser }) => {
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
    <div className="login" id="login">
      <form action="" onSubmit={(event) => login(event)}>
        <h1>Log in</h1>
        <input
          type="text"
          name="email"
          placeholder="E-mail adress"
          onChange={(e) => handleChange(e)}
        ></input>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => handleChange(e)}
        ></input>

        <div
          style={{
            width: "100%",

            textAlign: "center",
          }}
        >
          <button className="login_button">Log in</button>
        </div>

        <div className="user_interact">
          <div>
            <p>
              Don't have any account ? <br></br>
              <span>
                <u onClick={() => flip()}>Register</u>
              </span>
            </p>
          </div>

          <div>
            <p className="pass" onClick={() => forgetPass()}>
              Forget your password ?
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login_Form;
