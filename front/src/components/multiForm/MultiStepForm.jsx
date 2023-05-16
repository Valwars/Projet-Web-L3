import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { filluser } from "../../utils/APIRoutes";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "./multistep.css";

const Step1 = ({ values, handleChange, nextStep }) => {
  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Nom</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          required="required"
        />
      </div>
      <div className="fields">
        <label>Prénom</label>
        <input
          type="text"
          name="firstname"
          value={values.firstname}
          onChange={handleChange}
          required="required"
        />
      </div>

      <div className="fields">
        <label>Âge</label>
        <input
          type="number"
          name="age"
          value={values.age}
          onChange={handleChange}
          required="required"
        />
      </div>

      <div className="btncontainer alone">
        <button onClick={() => nextStep("animate-right")}>Suivant →</button>
      </div>
    </form>
  );
};

const Step2 = ({ values, handleChange, nextStep, prevStep }) => {
  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Sexe</label>
        <div className="choice">
          <div>
            {" "}
            <input type="checkbox" name="homme" value="homme"></input>
            <label for="homme">Homme</label>
          </div>
          <div>
            {" "}
            <input type="checkbox" name={"femme"} value="femme"></input>
            <label for="homme">Femme</label>
          </div>
        </div>
      </div>
      <div className="fields">
        <label>Sexualité</label>
        <select
          name="orientation"
          value={values.orientation}
          onChange={handleChange}
        >
          <option value="">--Choisi ton orientation--</option>
          <option value="Hétérosexuel">Hétérosexuel</option>
          <option value="Homosexuel">Homosexuel</option>
          <option value="Bisexuel">Bisexuel</option>
        </select>
      </div>
      <div className="fields">
        <label>Adresse complète</label>
        <input
          type="text"
          name="localisation"
          value={values.localisation}
          onChange={handleChange}
        />
      </div>

      <div className="btncontainer">
        <button onClick={() => prevStep("animate-left")}>Précédent</button>

        <button onClick={() => nextStep("animate-right")}>Suivant →</button>
      </div>
    </form>
  );
};

const Step3 = ({ values, handleChange, nextStep, prevStep }) => {
  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Photo de profil </label>
        <input
          type="file"
          name="pdp"
          value={values.pdp}
          onChange={handleChange}
        />
      </div>
      <div className="fields">
        <label>Décrivez vous !</label>
        <textarea
          type="file"
          name="description"
          value={values.description}
          onChange={handleChange}
        />
      </div>
      <div className="btncontainer">
        <button onClick={() => prevStep("animate-left")}>Précédent</button>

        <button onClick={() => nextStep("animate-right")}>Suivant →</button>
      </div>
    </form>
  );
};

const Step4 = ({ values, handleChange, nextStep, prevStep }) => {
  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Ajouter des photos à votre profil</label>
        <div className="depot">
          <div
            class="drag-area"
            // onDrop={handleDrop}
            //onDragOver={handleDragOver}
            //onDragLeave={handleDragLeave}
          >
            <div className="header-depot">
              Glisser déposer vos images ici...
            </div>
            <span>Ou</span>
            <label className="btn-browse">
              Parcourir les fichiers
              <input
                type="file"
                hidden //onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="btncontainer">
        <button onClick={() => prevStep("animate-left")}>Précédent</button>

        <button onClick={() => nextStep("animate-right")}>Suivant →</button>
      </div>
    </form>
  );
};

const Step5 = ({ values, handleChange }) => {
  return (
    <div className="loader">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

const MultiStepForm = () => {
  const inter = [
    "la lecture",
    "la musique",
    "le cinéma",
    "les voyages",
    "la randonnée",
    "le sport",
    "la cuisine",
    "la mode",
    "la danse",
    "l'art",
    "la photographie",
    "le jardinage",
    "les animaux",
    "la nature",
    "la technologie",
    "les jeux vidéo",
    "la cuisine asiatique",
    "les voitures",
    "le vin",
    "la bière",
    "les films d'horreur",
    "les comédies",
    "les documentaires",
    "la culture pop",
    "le design",
    "la décoration intérieure",
  ];

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
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
  });

  const [transition, setTransition] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch_data();
  }, [submitted]);

  const fetch_data = async () => {
    try {
      const response = await axios.post(filluser, {
        values,
      });
    } catch (error) {}
  };

  const handleChangedeux = (e) => {
    const { value, checked } = e.target;

    setValues((prevValues) => {
      if (checked) {
        return {
          ...prevValues,
          interests: [...prevValues.interests, value],
        };
      } else {
        return {
          ...prevValues,
          interests: prevValues.interests.filter(
            (interest) => interest !== value
          ),
        };
      }
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const nextStep = (side) => {
    setTransition(side);
    setTimeout(() => {
      setStep(step + 1);
      setTransition("");
    }, 500);
  };
  const prevStep = (side) => {
    setTransition(side);
    setTimeout(() => {
      setStep(step - 1);
      setTransition("");
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    setSubmitted(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            values={values}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2
            values={values}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3
            values={values}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Step4
            values={values}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return <Step5 />;

      default:
        // je dois ajouter le user dans le localstorage pour qu'il reste co est qu'il continue sa route
        // localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, );
        // je navigue vers la page principale après connexion car la création de son profil vient de terminer
        return navigate("/");
    }
  };

  return (
    <>
      {submitted ? (
        <h1>Form submitted</h1>
      ) : (
        // {navigate('/login')}
        <div className="app-page firstLoad">
          {step == 5 ? (
            <>
              <h1>{"Bienvenue, " + values.firstname + " !"}</h1>
              <p>
                Vous allez être redirigé vers notre application dans quelques
                instants...
              </p>
            </>
          ) : (
            <h1>Dites nous qui vous êtes.</h1>
          )}
          <div className={"container " + transition}>{renderStep()}</div>
          <ProgressBar step={step}></ProgressBar>
        </div>
      )}
    </>
  );
};
const ProgressBar = ({ step }) => {
  return (
    <div className="progress-bar">
      <div className={`progress-point${step >= 1 ? " active" : ""}`}></div>
      <div className={`progress-line${step >= 2 ? " active" : ""}`}></div>
      <div className={`progress-point${step >= 2 ? " active" : ""}`}></div>
      <div className={`progress-line${step >= 3 ? " active" : ""}`}></div>
      <div className={`progress-point${step >= 3 ? " active" : ""}`}></div>
      <div className={`progress-line${step >= 4 ? " active" : ""}`}></div>
      <div className={`progress-point${step >= 4 ? " active" : ""}`}></div>
      <div className={`progress-line${step >= 5 ? " active" : ""}`}></div>
      <div className={`progress-point${step >= 5 ? " active" : ""}`}></div>
    </div>
  );
};

export default MultiStepForm;
