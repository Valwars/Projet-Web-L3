import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader_transition from "../components/Loading";
import { datesRoute } from "../utils/APIRoutes";
import UserProfile from "./userProfile";
const Dates = ({ user, locate }) => {
  const navigate = useNavigate();
  const [leuser, setLeuser] = useState({});
  const [date, setDate] = useState([]);
  const [couple, setTab] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLeuser(user);
    const fetchData = async () => {
      setLeuser(user);
      console.log(leuser._id);
      var unid = leuser._id;
      try {
        const response = await axios.get(datesRoute, {
          params: {
            lid: unid,
          },
        });

        console.log("response", response.data.date);
        var tab = response.data.date;
        var coupletab = response.data.couple;
        setDate(tab);
        console.log("tab date", date);
        setTab(coupletab);
        console.log("couple", couple);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [leuser]);

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
                    navigate("/user-profile/2");
                  }}
                >
                  <div className="user-date">
                    <div>
                      <img
                        src="https://randomuser.me/api/portraits/women/22.jpg"
                        alt=""
                      />
                      <h2>Jane MaBite</h2>
                    </div>
                  </div>

                  <div className="dateInfo">
                    <div>
                      <i class="fas fa-clock"></i>

                      <p>{date.localisation}</p>
                    </div>
                    <div>
                      <i class="fas fa-map-marker-alt"></i>

                      <p>{date.date}</p>
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
