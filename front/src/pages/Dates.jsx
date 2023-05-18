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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLeuser(user);
    console.log(leuser._id);
    var unid = leuser._id;
    try {
      const response = await axios.get(datesRoute, {
        params: {
          lid: user._id,
        },
      });
      console.log(response.data.dates);

      setDate(response.data.dates);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
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
              <i className="fa fa-chevron-down"></i>

              <i className="fa fa-chevron-up"></i>
            </div>
            <input id="convtp" type="text" placeholder="Rechercher..." />
          </div>

          <div className="matchs-container">
            {date.map((date) => {
              // if (user.personnes[0] != undefined) {
              return (
                <div
                  className="match date_cnt"
                  onClick={() => {
                    // setLocate("/match");
                    navigate("/map/" + date._id);
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

                      <p>{date.date}</p>
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
        </div>
      )}
    </div>
  );
};

export default Dates;
