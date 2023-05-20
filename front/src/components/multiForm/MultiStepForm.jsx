import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fillForm, filluser } from "../../utils/APIRoutes";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "./multistep.css";

const toastOptions = {
  position: "bottom-right",
  autoClose: 6000,
  transition: Slide,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const Step1 = ({ values, handleChange, nextStep }) => {
  const verify = () => {
    if (values.firstname.length < 3) {
      toast.error("Prénom trop court.", toastOptions);

      return false;
    }

    if (values.name.length < 3) {
      toast.error("Nom trop court.", toastOptions);

      return false;
    }

    if (parseInt(values.age) < 18 || values.age === "") {
      toast.error("L'âge n'est pas valide.", toastOptions);

      return false;
    }

    return true;
  };
  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Nom</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
      <div className="fields">
        <label>Prénom</label>
        <input
          type="text"
          name="firstname"
          value={values.firstname}
          onChange={handleChange}
        />
      </div>

      <div className="fields">
        <label>Âge</label>
        <input
          type="number"
          name="age"
          value={values.age}
          onChange={handleChange}
        />
      </div>

      <div className="btncontainer alone">
        <button
          onClick={() => {
            if (verify()) {
              nextStep("animate-right");
            }
          }}
        >
          Suivant →
        </button>
      </div>
    </form>
  );
};

const Step2 = ({ values, handleChange, nextStep, prevStep }) => {
  const verify = () => {
    if (values.sexe === "") {
      toast.error("Veuillez sélectionner un sexe.", toastOptions);

      return false;
    }

    if (values.orientation === "") {
      toast.error("Veuillez sélectionner une sexualité.", toastOptions);

      return false;
    }

    if (values.localisation.length < 6) {
      toast.error("Veuillez saisir une adresse correcte.", toastOptions);

      return false;
    }

    return true;
  };

  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Sexe</label>
        <div className="choice">
          <div>
            {" "}
            <input
              type="radio"
              id="homme"
              name="sexe"
              value="homme"
              onChange={handleChange}
              checked={values.sexe === "homme"}
            ></input>
            <label for="homme">Homme</label>
          </div>
          <div>
            {" "}
            <input
              type="radio"
              id="femme"
              name="sexe"
              value="femme"
              onChange={handleChange}
              checked={values.sexe === "femme"}
            ></input>
            <label for="femme">Femme</label>
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
        <button onClick={() => prevStep("animate-left")}>← Précédent</button>

        <button
          onClick={() => {
            if (verify()) {
              nextStep("animate-right");
            }
          }}
        >
          Suivant →
        </button>
      </div>
    </form>
  );
};

const Step3 = ({
  values,
  handleChange,
  handleProfilPic,
  nextStep,
  prevStep,
}) => {
  const verify = () => {
    if (values.description.length < 22) {
      toast.error("Votre description doit être plus longue.", toastOptions);

      return false;
    }

    if (values.pdp === "") {
      toast.error("Veuillez ajouter une photo de profil.", toastOptions);

      return false;
    }

    return true;
  };

  return (
    <form className="multisteps" onSubmit={(e) => e.preventDefault()}>
      <div className="fields">
        <label>Photo de profil </label>
        <label htmlFor="upload-photo" className="custom-file-upload">
          {values.pdp.name || "Télécharger la photo"}
        </label>
        <input
          id="upload-photo"
          type="file"
          className="input-file"
          name="pdp"
          onChange={(e) => handleProfilPic(e)}
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
        <button onClick={() => prevStep("animate-left")}>← Précédent</button>

        <button
          onClick={() => {
            if (verify()) {
              nextStep("animate-right");
            }
          }}
        >
          Suivant →
        </button>
      </div>
    </form>
  );
};

const Step4 = ({
  values,
  handleFileChange,
  removeFile,
  nextStep,
  prevStep,
}) => {
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
              <input multiple type="file" hidden onChange={handleFileChange} />
            </label>
            <div className="picsuploaded">
              {values.photos.map((file, index) => (
                <div key={index} onClick={() => removeFile(file)}>
                  {file}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="btncontainer">
        <button onClick={() => prevStep("animate-left")}>← Précédent</button>

        <button onClick={() => nextStep("animate-right")}>Suivant →</button>
      </div>
    </form>
  );
};

const Step5 = ({
  values,
  handleChangedeux,
  nextStep,
  prevStep,
  inter,
  handleSubmit,
}) => {
  const verify = () => {
    if (values.interests.length < 3) {
      toast.error("Veuillez choisir au moins 3 intêrets.", toastOptions);

      return false;
    }

    return true;
  };
  return (
    <form
      className="multisteps"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="fields">
        <label>Selectionner vos centres d'intêrets</label>
        <div className="interest_form">
          {inter.map((int, index) => {
            return (
              <div className="inter" key={index}>
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  value={int}
                  onChange={handleChangedeux}
                  checked={values.interests.includes(int)}
                  disabled={
                    !values.interests.includes(int) &&
                    values.interests.length >= 6
                  }
                />
                <label htmlFor={`checkbox-${index}`}>{int}</label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="btncontainer">
        <button onClick={() => prevStep("animate-left")}>← Précédent</button>

        <button
          onClick={(e) => {
            if (verify()) {
              handleSubmit(e);
            }
          }}
        >
          Valider →
        </button>
      </div>
    </form>
  );
};

const Step6 = ({ values, handleChange }) => {
  return (
    <div className="loader">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

const MultiStepForm = ({ user }) => {
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

  const [selectedProfilPic, setSelectedProfilePic] = useState(null);

  const handleProfilPic = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.includes("image")) {
      setValues({ ...values, pdp: selectedFile });
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfilePic(reader.result);
      };

      reader.readAsDataURL(selectedFile);

      console.log(values);
    } else {
      setValues({ ...values, pdp: "" });
      alert("Le fichier doit être une image !");
    }
  };

  const [selectedPics, setSelectedPics] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPics((prevSelectedFiles) => [...prevSelectedFiles, ...files]);

    const fileNames = files.map((file) => file.name);
    setValues((prevValues) => ({
      ...prevValues,
      photos: [...prevValues.photos, ...fileNames],
    }));

    console.log(selectedPics);
  };

  const removeFile = (fileName) => {
    const updatedSelectedFiles = selectedPics.filter(
      (file) => file.name !== fileName
    );
    setSelectedPics(updatedSelectedFiles);

    setValues((prevValues) => ({
      ...prevValues,
      photos: prevValues.photos.filter((name) => name !== fileName),
    }));
  };

  const [transition, setTransition] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChangedeux = (e) => {
    const { value, checked } = e.target;

    if (checked && values.interests.length < 6) {
      setValues((prevValues) => {
        return {
          ...prevValues,
          interests: [...prevValues.interests, value],
        };
      });
    } else if (!checked) {
      setValues((prevValues) => {
        return {
          ...prevValues,
          interests: prevValues.interests.filter(
            (interest) => interest !== value
          ),
        };
      });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(user);
    const formData = new FormData();
    formData.append("id", user._id);

    formData.append("name", values.name);
    formData.append("firstname", values.firstname);
    formData.append("age", values.age);
    formData.append("description", values.description);
    values.interests.forEach((interest, index) => {
      formData.append(`interests[${index}]`, interest);
    });
    formData.append("localisation", values.localisation);
    formData.append("orientation", values.orientation);
    formData.append("sexe", values.sexe);

    for (let i = 0; i < values.photos.length; i++) {
      formData.append("photos", values.photos[i]);
    }

    for (let i = 0; i < selectedPics.length; i++) {
      formData.append("photos", selectedPics[i]);
    }

    formData.append("pdp", values.pdp);

    const result = await axios.post(fillForm, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(result);
    if (result.data.status === "ok") {
      toast.success("Profil sauvegardé !", toastOptions);
      nextStep("animate-right");

      setTimeout(() => {
        window.location.reload();
      }, 6000);
    } else {
      toast.error("Erreur !", toastOptions);
    }
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
            handleProfilPic={handleProfilPic}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <Step4
            values={values}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <Step5
            values={values}
            handleChangedeux={handleChangedeux}
            nextStep={nextStep}
            prevStep={prevStep}
            inter={inter}
            handleSubmit={handleSubmit}
          />
        );
      case 6:
        return <Step6 />;

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
          {step == 6 ? (
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
      <div className={`progress-line${step >= 6 ? " active" : ""}`}></div>
      <div className={`progress-point${step >= 6 ? " active" : ""}`}></div>
    </div>
  );
};

export default MultiStepForm;
