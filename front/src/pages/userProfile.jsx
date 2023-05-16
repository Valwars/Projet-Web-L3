import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { save, userRoute } from "../utils/APIRoutes";
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
  });

  const [nombre_match, setnombre_match] = useState([
    { date: "10/02", count: 3 },
    { date: "11/02", count: 4 },
    { date: "12/02", count: 7 },
    { date: "13/02", count: 0 },
    { date: "14/02", count: 2 },
    { date: "15/02", count: 3 },
    { date: "16/02", count: 4 },
    { date: "17/02", count: 0 },
  ]);

  const [nombre_conversation, setConversation] = useState([
    { date: "10/02", count: 11 },
    { date: "11/02", count: 4 },
    { date: "12/02", count: 7 },
    { date: "13/02", count: 2 },
    { date: "14/02", count: 8 },
    { date: "15/02", count: 3 },
    { date: "16/02", count: 7 },
    { date: "17/02", count: 1 },
  ]);

  const [nombre_date, setnombre_date] = useState([
    { date: "10/02", count: 3 },
    { date: "11/02", count: 0 },
    { date: "12/02", count: 1 },
    { date: "13/02", count: 2 },
    { date: "14/02", count: 0 },
    { date: "15/02", count: 0 },
    { date: "16/02", count: 0 },
    { date: "17/02", count: 0 },
  ]);

  const [nombre_swipe, setnombre_swipe] = useState([
    { date: "10/02", count: 9 },
    { date: "11/02", count: 5 },
    { date: "12/02", count: 3 },
    { date: "13/02", count: 8 },
    { date: "14/02", count: 10 },
    { date: "15/02", count: 5 },
    { date: "16/02", count: 0 },
    { date: "17/02", count: 2 },
  ]);

  const data_match = {
    labels: nombre_match.map((item) => item.date),
    datasets: [
      {
        label: "Nombre de matchs depuis votre inscription",
        data: nombre_match.map((item) => item.count),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const data_conversation = {
    labels: nombre_conversation.map((item) => item.date),
    datasets: [
      {
        label: "Nombre de conversations depuis votre inscription",
        data: nombre_conversation.map((item) => item.count),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const data_date = {
    labels: nombre_date.map((item) => item.date),
    datasets: [
      {
        label: "Nombre de dates depuis votre inscription",
        data: nombre_date.map((item) => item.count),
        fill: false,
        borderColor: "#FF7A7A",
      },
    ],
  };

  const data_swipe = {
    labels: nombre_swipe.map((item) => item.date),
    datasets: [
      {
        label: "Swipe depuis le 10 Mai 2021",
        data: nombre_swipe.map((item) => item.count),
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
        max: nombre_swipe.reduce((max, obj) => Math.max(max, obj.count), 0) + 2,
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
        max: nombre_match.reduce((max, obj) => Math.max(max, obj.count), 0) + 2,
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
          nombre_conversation.reduce(
            (max, obj) => Math.max(max, obj.count),
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
        max: nombre_date.reduce((max, obj) => Math.max(max, obj.count), 0) + 2,
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
    updatedContent.splice(index, 1);
    setValues({ ...values, photos: updatedContent });
  };

  const handleSave = async () => {
    if (values.interests.length < 3) {
      toast.error("Veuillez choisir au moins 3 intêrets.", toastOptions);
      return;
    }
    const result = await axios.post(save, { values });

    console.log(result);
    if (result.data.status === "ok") {
      toast.success("Profil sauvegardé !", toastOptions);
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
        photos: values.photos,
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
                <img className="pdp" src={user.pdp} alt="" />

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
                            <img src={photo} alt="" />
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
                              type="file"
                              hidden //onChange={handleFileChange}
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
            <>
              <div className="haut-profil">
                <img className="pdp" src={user.pdp} alt="" />
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
                        <img src={photo} alt="" />
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
                    {nombre_swipe.reduce((acc, curr) => acc + curr.count, 0)}
                  </h1>
                  <div>
                    <Line
                      className="graphiques"
                      data={data_swipe}
                      options={options_stat_swipe}
                    />
                    <div className="btn_stats">
                      <button>1 sem</button>
                      <button>1 m</button>
                      <button>Tout</button>
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
                      <button>1 sem</button>
                      <button>1 m</button>
                      <button>Tout</button>
                    </div>
                  </div>

                  <h1>
                    {nombre_match.reduce((acc, curr) => acc + curr.count, 0)}
                  </h1>
                </div>

                <h4>Conversations</h4>
                <div className="stat">
                  <h1>
                    {nombre_conversation.reduce(
                      (acc, curr) => acc + curr.count,
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
                      <button>1 sem</button>
                      <button>1 m</button>
                      <button>Tout</button>
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
                      <button>1 sem</button>
                      <button>1 m</button>
                      <button>Tout</button>
                    </div>
                  </div>

                  <h1>
                    {nombre_date.reduce((acc, curr) => acc + curr.count, 0)}
                  </h1>
                </div>
              </div>
            </>
          )}
        </div>
      )}{" "}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;
