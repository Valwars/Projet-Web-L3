import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getStat, getImage, save, userRoute } from "../utils/APIRoutes";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ToastContainer, toast, Slide } from "react-toastify";

import Loader_transition from "../components/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const toastOptions = {
  position: "bottom-right",
  autoClose: 6000,
  transition: Slide,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const UserProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [photosLimit, setPhotosLimit] = useState(3); // Limite de photos affichées
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [limite, setLimite] = useState(7);
  const [values, setValues] = useState({
    id: user._id,
    name: user.name,
    firstname: user.firstname,
    age: user.age,
    description: user.description,
    interests: user.interests,
    localisation: user.localisation,
    orientation: user.orientation,
    photos: user.photos,
    pdp: user.pdp,
  });

  const [limit, setLimit] = useState({limit_match : 7, limit_swipe : 7, limit_conversation: 7, limit_date: 7});
  const [swipe, setNombreSwipe] = useState([]);
  const [match, setNombreMatch] = useState([]);
  const [conversation, setNombreConversation] = useState([]);
  const [date, setNombreDate] = useState([]);

  useEffect(() => {
    fetch_data();
  }, []);

  const fetch_data = async () => {
    console.log("fetch");
    try {
      console.log("dans le try");
      const response = await axios.get(getStat, {
        params: {
          userId: user._id,
          limit: limit
        },
      });
      setNombreMatch(response.data.stat_matchs);
      setNombreSwipe(response.data.stat_swipes);
      setNombreConversation(response.data.stat_conversations);
      setNombreDate(response.data.stat_dates);
      console.log(response.data);
    } catch (error) {}
  };

  const data_match = {
    labels: match.map((item) => item.createdAt),
    datasets: [
      {
        label: "Nombre de matchs depuis votre inscription",
        data: match.map((item) => item.nombre_match),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const data_conversation = {
    labels: conversation.map((item) => item.createdAt),
    datasets: [
      {
        label: "Nombre de conversations depuis votre inscription",
        data: conversation.map((item) => item.nombre_conversation),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const data_date = {
    labels: date.map((item) => item.createdAt),
    datasets: [
      {
        label: "Nombre de dates depuis votre inscription",
        data: date.map((item) => item.nombre_date),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const data_swipe = {
    labels: swipe.map((item) => item.createdAt),
    datasets: [
      {
        label: "Swipe depuis le 10 Mai 2021",
        data: swipe.map((item) => item.nombre_swipe),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const options_stat_swipe = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: swipe.reduce((max, obj) => Math.max(max, obj.nombre_swipe), 0) + 2,
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const options_stat_match = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: match.reduce((max, obj) => Math.max(max, obj.nombre_match), 0) + 2,
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const options_stat_conversation = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max:
          conversation.reduce(
            (max, obj) => Math.max(max, obj.nombre_conversation),
            0
          ) + 2,
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const options_stat_date = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: date.reduce((max, obj) => Math.max(max, obj.nombre_date), 0) + 2,
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const deletepic = (index) => {
    const updatedContent = [...values.photos];

    const deletedItem = updatedContent[index];

    updatedContent.splice(index, 1);
    setValues({ ...values, photos: updatedContent });
    setDeleted([...deletedFiles, deletedItem]);
  };

  const [selectedPics, setSelectedPics] = useState([]);

  const handleNewPic = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPics((prevSelectedFiles) => [...prevSelectedFiles, ...files]);

    const fileNames = files.map((file) => file.name);
    setValues((prevValues) => ({
      ...prevValues,
      photos: [...prevValues.photos, ...fileNames],
    }));

    console.log(selectedPics);
  };

  const [deletedFiles, setDeleted] = useState([]);
  const handleSave = async () => {
    if (values.interests.length < 3) {
      toast.error("Veuillez choisir au moins 3 intêrets.", toastOptions);
      return;
    }

    const formData = new FormData();
    formData.append("id", values.id);
    formData.append("name", values.name);
    formData.append("firstname", values.firstname);
    formData.append("age", values.age);
    formData.append("description", values.description);
    values.interests.forEach((interest, index) => {
      formData.append(`interests[${index}]`, interest);
    });
    formData.append("localisation", values.localisation);
    formData.append("orientation", values.orientation);

    for (let i = 0; i < selectedPics.length; i++) {
      formData.append("photos", selectedPics[i]);
    }

    for (let i = 0; i < user.photos.length; i++) {
      formData.append("oldpic", user.photos[i]);
    }

    for (let i = 0; i < deletedFiles.length; i++) {
      formData.append("deletedPics", deletedFiles[i]);
    }
    formData.append("pdp", values.pdp);

    const result = await axios.post(save, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(result);
    if (result.data.status === "ok") {
      toast.success("Profil sauvegardé !", toastOptions);
      console.log(result.data.filename);
      var pdp = user.pdp;
      if (result.data.filename) {
        pdp = result.data.filename;
      }
      var pics = user.photos;

      if (result.data.pics) {
        pics = result.data.pics;
      }

      console.log(result.data.pics);

      setUser((prevUser) => ({
        ...prevUser,
        _id: values.id,
        name: values.name,
        firstname: values.firstname,
        age: values.age,
        description: values.description,
        interests: values.interests,
        localisation: values.localisation,
        orientation: values.orientation,
        photos: pics,
        pdp: pdp,
      }));

      setEdit(false);
    } else {
      toast.error("Erreur !", toastOptions);
    }
  };
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

  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.includes("image")) {
      setValues({ ...values, pdp: selectedFile });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setValues({ ...values, pdp: user.pdp });
      alert("Le fichier doit être une image !");
    }
  };

  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="profile-content">
          {edit ? (
            <button
              className="disco"
              onClick={() => {
                handleSave();
              }}
            >
              Sauvegarder <i class="fas fa-user-edit" aria-hidden="true"></i>
            </button>
          ) : (
            <button
              className="disco"
              onClick={() => {
                setEdit(!edit);
              }}
            >
              Editer <i class="fas fa-user-edit" aria-hidden="true"></i>
            </button>
          )}

          <button
            className="disco"
            onClick={() => {
              localStorage.clear();
              navigate("/");

              window.location.reload();
            }}
          >
            Déconnexion <i class="fa fa-sign-out" aria-hidden="true"></i>
          </button>

          {edit ? (
            <div>
              <div className="edit">
                <div className="edit_pdp">
                  <img
                    className="pdp"
                    src={imagePreview ? imagePreview : getImage + user.pdp}
                    alt=""
                  />
                  <label className="btn-browse">
                    Browse File
                    <input type="file" hidden onChange={handleFileChange} />
                  </label>{" "}
                </div>

                <div className="infos">
                  <div>
                    <label htmlFor="firstName">Prenom : </label>
                    <input
                      type="text"
                      value={values.firstname}
                      onChange={(e) =>
                        setValues({ ...values, firstname: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="name">Nom : </label>{" "}
                    <input
                      type="text"
                      value={values.name}
                      onChange={(e) =>
                        setValues({ ...values, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="name">Age : </label>{" "}
                    <input
                      type="number"
                      value={values.age}
                      onChange={(e) =>
                        setValues({ ...values, age: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="name">Orientation : </label>{" "}
                    <input
                      type="text"
                      value={values.orientation}
                      onChange={(e) =>
                        setValues({ ...values, orientation: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="localisation">Adresse : </label>

                    <input
                      type="text"
                      value={values.localisation}
                      onChange={(e) =>
                        setValues({ ...values, localisation: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="description">Description : </label>

                    <input
                      type="text"
                      value={values.description}
                      onChange={(e) =>
                        setValues({ ...values, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <h2>Gérez vos intêrets :</h2>{" "}
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

                <div className="user-pics">
                  <h2>Vos photos :</h2>
                  <div className="addpic">
                    <div className="pics-container">
                      {values.photos.map((photo, index) => {
                        return (
                          <div className="pic" onClick={() => deletepic(index)}>
                            {" "}
                            <div className="deletebg"></div>
                            <img src={getImage + photo} alt="" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="addpics">
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
                              multiple
                              type="file"
                              hidden
                              onChange={handleNewPic}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="stats_front">
              <div className="haut-profil">
                <img className="pdp" src={getImage + user.pdp} alt="" />
                <h1>{user.name + " " + user.firstname}</h1>
                <div className="profil-information">
                  <h2>{user.age + " ans"}</h2>{" "}
                  <span>
                    <h2>{user.orientation}</h2>
                  </span>
                </div>
                <p>{user.description}</p>
              </div>
              <div className="interests">
                {user.interests.map((inte) => {
                  return <h2>{inte}</h2>;
                })}
              </div>

              <div className="user-pics">
                <h2>Vos photos :</h2>
                <div className="pics-container">
                  {user.photos.slice(0, photosLimit).map((photo) => {
                    return (
                      <div className="pic">
                        <img src={getImage + photo} alt="" />
                      </div>
                    );
                  })}
                </div>{" "}
                {photosLimit == 6 ? (
                  <></>
                ) : (
                  <button
                    className="showmorepics"
                    onClick={() => setPhotosLimit(photosLimit + 3)}
                  >
                    Voir plus
                  </button>
                )}
              </div>
              <h2>Statistiques :</h2>
              <h4>Swipes</h4>
              <div className="profile-stats">
                <div className="stat">
                  <h1>
                    {swipe.reduce((acc, curr) => acc + curr.nombre_swipe, 0)}
                  </h1>
                  <div>
                    <Line
                      className="graphiques"
                      data={data_swipe}
                      options={options_stat_swipe}
                    />
                    <div className="btn_stats">
                      <button onClick = {() => setLimit({...limite, limit_swipe: 7})}>1 sem</button>
                      <button onClick = {() => setLimit({...limite, limit_swipe: 30})}>1 m</button>
                      <button onClick = {() => setLimit({...limite, limit_swipe: -1})}>Tout</button>
                    </div>
                  </div>
                </div>

                <h4>Matchs</h4>
                <div className="stat stat_respo ">
                  <div>
                    <Line
                      className="graphiques"
                      data={data_match}
                      options={options_stat_match}
                    />
                    <div className="btn_stats">
                      <button onClick = {() => setLimit({...limite, limit_match: 7})}>1 sem</button>
                      <button onClick = {() => setLimit({...limite, limit_match: 30})}>1 m</button>
                      <button onClick = {() => setLimit({...limite, limit_match: -1})}>Tout</button>
                    </div>
                  </div>

                  <h1>
                    {match.reduce((acc, curr) => acc + curr.nombre_match, 0)}
                  </h1>
                </div>

                <h4>Conversations</h4>
                <div className="stat">
                  <h1>
                    {conversation.reduce(
                      (acc, curr) => acc + curr.nombre_conversation,
                      0
                    )}
                  </h1>
                  <div>
                    <Line
                      className="graphiques"
                      data={data_conversation}
                      options={options_stat_conversation}
                    />
                    <div className="btn_stats">
                      <button onClick = {() => setLimit({...limite, limit_conversation: 7})}>1 sem</button>
                      <button onClick = {() => setLimit({...limite, limit_conversation: 30})}>1 m</button>
                      <button onClick = {() => setLimit({...limite, limit_conversation: -1})}>Tout</button>
                    </div>
                  </div>
                </div>
                <h4>Dates</h4>
                <div className="stat stat_respo ">
                  <div>
                    <Line
                      className="graphiques"
                      data={data_date}
                      options={options_stat_date}
                    />
                    <div className="btn_stats">
                      <button onClick = {() => setLimit({...limite, limit_date: 7})}>1 sem</button>
                      <button onClick = {() => setLimit({...limite,  limit_date: 30})}>1 m</button>
                      <button onClick = {() => setLimit({...limite,  limit_date: -1})}>Tout</button>
                    </div>
                  </div>

                  <h1>
                    {date.reduce((acc, curr) => acc + curr.nombre_date, 0)}
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
      )}{" "}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
