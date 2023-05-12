import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { datesRoute } from "../utils/APIRoutes";
import UserProfile from "./userProfile";
const Dates = ({ user, locate }) => {

  const navigate = useNavigate();
  const [leuser, setLeuser] = useState({});
  const [date, setDate] = useState([]);
  const [couple, setTab] = useState([]);

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

        console.log("response",response.data.date);
        var tab = response.data.date;
        var coupletab = response.data.couple;
        setDate(tab);
        console.log("tab date",date);
        setTab(coupletab);
        console.log("couple",couple);

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [leuser])



  return (

    <div className="app-page">
      <div className="match-content">
        <div className="top">
          <h1>Vos dates</h1>
          <input type="text" placeholder="Rechercher..." />
        </div>
        <div className="matchs-container">
          {
            date.map((date) => {
              // if (user.personnes[0] != undefined) {
                return (
                  <div
                    className="match"
                    onClick={() => {
                      // setLocate("/match");
                      navigate("/user-profile/2");
                    }}
                  >
                    {couple.map((u) => {

                      if ( u.premier._id == date.premier._id && u.second._id == date.second._id){
                         return (
                        <>
                        <img src={u.premier.pdp} alt="" />
                          {/* <img src={u.premier.pdp} alt="" />
                          <h2>{u.premier.name + " " + u.premier.firstname}</h2>
                          <img src={u.second.pdp} alt="" />
                          <h2>{u.second.name + " " + u.second.firstname}</h2> */}
                        </>
                      )
                       } else {
                        return null;
                      }
                     
                    })}
                    <p>{date.localisation}</p>

                    <p>{date.date}</p>
                  </div>
                )
              // } else {
              //   return null;
              // }
            })
          }

        </div>
      </div>
    </div>
  );
};

export default Dates;
