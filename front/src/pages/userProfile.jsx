import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { userRoute } from "../utils/APIRoutes";
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

const UserProfile = ({ user, locate }) => {
  const navigate = useNavigate();
  const [photosLimit, setPhotosLimit] = useState(3); // Limite de photos affichées
  const [loading, setLoading] = useState(false);

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
    { date: "10/02", count: 11},
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
        borderColor: "rgb(75, 192, 192)",
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
        borderColor: "rgb(75, 192, 192)",
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
        borderColor: "rgb(75, 192, 192)",
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
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options_stat = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        
      },
    },
    scales: {
      y: {
        min: 0,
        max: 12,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
        },
      },
    },
  };

  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="profile-content">
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
          <h4>Swipes <button>Semaine</button><button>Tout</button></h4>
          <div className="profile-stats">
            <div className="stat">
              <h1>{nombre_swipe.reduce((acc, curr) => acc + curr.count, 0)}</h1>
              <Line
                className="graphiques"
                data={data_swipe}
                options={options_stat}
              />
            </div>

            <h4>Matchs  <button>Semaine</button><button>Tout</button></h4>
            <div className="stat">
              <Line
                className="graphiques"
                data={data_match}
                options={options_stat}
              />
              <h1>{nombre_match.reduce((acc, curr) => acc + curr.count, 0)}</h1>
            </div>

            <h4>Conversations<button>Semaine</button><button>Tout</button></h4>
            <div className="stat">
              <h1>{nombre_conversation.reduce((acc, curr) => acc + curr.count, 0)}</h1>
              <Line
                className="graphiques"
                data={data_conversation}
                options={options_stat}
              />
            </div>
            <h4>Dates<button>Semaine</button><button>Tout</button></h4>
            <div className="stat">
              <Line
                className="graphiques"
                data={data_date}
                options={options_stat}
              />
              <h1>{nombre_date.reduce((acc, curr) => acc + curr.count, 0)}</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
