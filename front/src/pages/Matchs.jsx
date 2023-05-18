import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader_transition from "../components/Loading";
import { match } from "../utils/APIRoutes";
import axios from "axios";

const Matchs = ({ user, setLocate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [matchs, setMatch] = useState([]);

  
  // useEffect(()=>{
  //   fetch_data();
  // })

  // const fetch_data = async ()=> {
  //   const response = await axios.get(match,{
  //     params: {
  //       currentuser: user._id,
  //     },
  //   })
  //   console.log(response.data.match)
  //   setMatch(response.data.match)
  // }
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
