import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Matchs = ({ user, setLocate }) => {
  const navigate = useNavigate();

  const matchs = [
    {
      id: "23",
      nom: "Jane",
      prenom: "Cooper",
      pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
      id: "23",
      nom: "Jane",
      prenom: "Cooper",
      pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
      id: "23",
      nom: "Jane",
      prenom: "Cooper",
      pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
      id: "23",
      nom: "Jane",
      prenom: "Cooper",
      pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
  ];

  return (
    <div className="app-page">
      <div className="match-content">
        <div className="top">
          <h1>Vos matchs</h1>
          <input type="text" placeholder="Rechercher..." />
        </div>
        <div className="matchs-container">
          {matchs.map((match) => {
            return (
              <div
                className="match"
                onClick={() => {
                  setLocate("/match");
                  navigate("/user-profile?i=2");
                }}
              >
                <img src={match.pdp} alt="" />
                <h2>{match.nom + " " + match.prenom}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Matchs;
