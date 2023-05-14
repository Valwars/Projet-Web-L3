import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader_transition from "../components/Loading";

const Matchs = ({ user, setLocate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="match-content">
          <div className="top">
            <h1>Vos matchs</h1>
            <div className="order-filters">
              <i className="fa fa-chevron-down"></i>

              <i className="fa fa-chevron-up"></i>
            </div>
            <input id="convtp" type="text" placeholder="Rechercher..." />
          </div>
          <div className="matchs-container">
            {matchs.map((match) => {
              return (
                <div
                  className="match"
                  onClick={() => {
                    setLocate("/match");
                    navigate("/user-profile/2");
                  }}
                >
                  <img src={match.pdp} alt="" />
                  <h2>{match.nom + " " + match.prenom}</h2>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Matchs;
