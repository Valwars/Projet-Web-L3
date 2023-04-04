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
  const [tab, setTab] = useState([]);

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

        console.log(response.data.premier);
        console.log(response.data.second);
        var premier = response.data.premier;
        var second = response.data.second;
        var ledate = { 
          personnes : [premier, second],
          date : "demain",
          localisation : "Bozouls"
        }
        // setTab(tab => {
        //   tab.push(ledate);
          
        //   return tab;
        // });
        setTab(prevTab => [...prevTab, ledate]);
        console.log(tab)
   


      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [leuser])

  // useEffect(() => {
  //   console.log(tab);
  // }, [tab]);

  return (

    <div className="app-page">
      <div className="match-content">
        <div className="top">
          <h1>Vos dates</h1>
          <input type="text" placeholder="Rechercher..." />
        </div>
        <div className="matchs-container">
          {
            tab.map((user) => {
              if (user != undefined) {
                return (
                  <div
                  className="match"
                  onClick={() => {
                    // setLocate("/match");
                    navigate("/user-profile/2");
                  }}
                >                 
                    {user.personnes.map((u)=>{
                     if (u != undefined){
                       return (
                       <>
                       <img src={u.pdp} alt="" />
                        <h2>{u.name + " " + u.firstname}</h2> 
                       </>
                        
                      )
                     }else {
                      return null;
                     }
                    
                    })} 
                    
                    <p>{user.localisation}</p>
                    <p>{user.date}</p>
                  </div>
                )
              } else {
                return null;
              }
            })
          }
         
        </div>
      </div>
    </div>
  );
};

export default Dates;
