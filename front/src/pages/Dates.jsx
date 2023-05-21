import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader_transition from "../components/Loading";
import { getImage, datesRoute } from "../utils/APIRoutes";
import UserProfile from "./userProfile";
const Dates = ({ user, locate }) => {
  const navigate = useNavigate();
  const [leuser, setLeuser] = useState({});
  const [date, setDate] = useState([]);
  const [searsh, setSearsh] = useState("");
  const [sort, setSort] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [searsh, sort]);

  const fetchData = async () => {
    setLeuser(user);
    console.log(leuser._id);

    try {
      const response = await axios.get(datesRoute, {
        params: {
          unid: user._id,
          searchString: searsh,
          order: sort,
        },
      });
      console.log(response.data.dates);

      setDate(response.data.dates);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handle_sort = (e) => {
    document
      .getElementsByClassName("filter-order-active")[0]
      .classList.remove("filter-order-active");
    e.target.classList.add("filter-order-active");
  };

  const formatDate = (originalDate) => {
    // Conversion de la date en objet Date
    let date = new Date(originalDate);

    // Récupération des parties de la date
    let day = date.getDate();
    let month = date.getMonth() + 1; // Les mois sont de 0 (janvier) à 11 (décembre)
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();

    // Ajout d'un zéro au début si nécessaire
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Construction de la nouvelle chaine de caractères
    let formattedDate =
      hour + "h" + minutes + " - " + day + "/" + month + "/" + year;

    return formattedDate;
  };
  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="match-content">
          <div className="top">
            <h1>Vos dates</h1>
            <div className="order-filters">
              <i
                className="fa fa-chevron-down filter-order-active"
                onClick={(e) => {
                  handle_sort(e);
                  setSort(1);
                }}
              ></i>

              <i
                className="fa fa-chevron-up"
                onClick={(e) => {
                  handle_sort(e);
                  setSort(-1);
                }}
              ></i>
            </div>
            <input
              id="convtp"
              type="text"
              placeholder="Rechercher..."
              onChange={(e) => setSearsh(e.target.value)}
            />{" "}
          </div>
          {date.length == 0 ? (
            <>
              <div className="no_conv">
                {searsh.length > 0 ? (
                  <h2>Pas de résulats correspondants !</h2>
                ) : (
                  <h2>Tu n'as pas encore de dates !</h2>
                )}
              </div>
            </>
          ) : (
            <div className="matchs-container">
              {date.map((date) => {
                // if (user.personnes[0] != undefined) {
                return (
                  <div
                    className="match date_cnt"
                    onClick={() => {
                      // setLocate("/match");
                      navigate("/map?id=" + date._id);
                    }}
                  >
                    <div className="user-date">
                      <div>
                        <img src={getImage + date.pdp} alt="" />
                        <h2>
                          {date.name} {date.firstname}
                        </h2>
                      </div>
                    </div>

                    <div className="dateInfo">
                      <div>
                        <i class="fas fa-clock"></i>

                        <p>{formatDate(date.date)}</p>
                      </div>
                      <div>
                        <i class="fas fa-map-marker-alt"></i>

                        <p>{date.localisation}</p>
                      </div>
                    </div>
                  </div>
                );
                // } else {
                //   return null;
                // }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dates;
