import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { filluser } from "../utils/APIRoutes";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import("../multistep.css");

const Step1 = ({ values, handleChange }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          required="required"
        />
      </div>
      <div className="fields">
        <label>First name</label>
        <input
          type="text"
          name="firstname"
          value={values.firstname}
          onChange={handleChange}
          required="required"
        />
      </div>
    </form>
  );
};

const Step2 = ({ values, handleChange }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Address</label>
        <input
          type="text"
          name="localisation"
          value={values.localisation}
          onChange={handleChange}
          required="required"
        />
      </div>
    </form>
  );
};

const Step3 = ({ values, handleChange }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Age</label>
        <input
          type="number"
          name="age"
          min="1"
          value={values.age}
          onChange={handleChange}
          required="required"
        />
      </div>
    </form>
  );
};

const Step4 = ({ values, handleChange }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Profile picture</label>
        <input
          type="file"
          name="pdp"
          value={values.pdp}
          onChange={handleChange}
          required="required"
        />
      </div>
      <div className="fields">
        <label>Some pictures of you</label>
        <input
          type="file"
          name="photos"
          value={values.photos}
          onChange={handleChange}
          required="required"
        />
      </div>
    </form>
  );
};

const Step5 = ({ values, handleChange }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Your sex</label>
        <select
          name="sexe"
          value={values.sexe}
          onChange={handleChange}
          required="required"
        >
          <option value="">--Please choose your sex--</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
        </select>
      </div>
      <div className="fields">
        <label>Your orientation</label>
        <select
          name="orientation"
          value={values.orientation}
          onChange={handleChange}
          required="required"
        >
          <option value="">--Please choose your sex--</option>
          <option value="Hétérosexuel">Hétérosexuel</option>
          <option value="Homosexuel">Homosexuel</option>
          <option value="Bisexuel">Bisexuel</option>
        </select>
      </div>
    </form>
  );
};

const Step6 = ({ values, handleChange }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Your description</label>
        <textarea
          name="description"
          cols="50"
          rows="6"
          value={values.description}
          onChange={handleChange}
          required="required"
        />
      </div>
    </form>
  );
};

const Step7 = ({ values, inter, handleChangedeux }) => {
  return (
    <form className="multisteps">
      <div className="fields">
        <label>Your interests</label>
        {inter.map((interet) => {
          return (
            <label key={interet}>
              {" "}
              {interet} :{" "}
              <input
                type="checkbox"
                objet="interests"
                name={values.interests}
                value={interet}
                onChange={(e) => handleChangedeux(e)}
              />
            </label>
          );
        })}
      </div>
    </form>
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
          interests: prevValues.interests.filter((interest) => interest !== value),
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
        return <Step1 values={values} handleChange={handleChange} />;
      case 2:
        return <Step2 values={values} handleChange={handleChange} />;
      case 3:
        return <Step3 values={values} handleChange={handleChange} />;
      case 4:
        return <Step4 values={values} handleChange={handleChange} />;
      case 5:
        return <Step5 values={values} handleChange={handleChange} />;
      case 6:
        return <Step6 values={values} handleChange={handleChange} />;
      case 7:
        return (
          <Step7
            values={values}
            inter={inter}
            handleChangedeux={handleChangedeux}
          />
        );

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
        <div className="app-page">
          <div className={"container " + transition}>
            {renderStep()}
            <div className="btncontainer">
              {step > 1 && (
                <button onClick={() => prevStep("animate-left")}>
                  Previous
                </button>
              )}
              {step < 7 && (
                <button onClick={() => nextStep("animate-right")}>Next</button>
              )}
              {step === 7 && <button onClick={handleSubmit}>Submit</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultiStepForm;
