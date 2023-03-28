import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { datesRoute } from "../utils/APIRoutes";
import UserProfile from "./userProfile";
const Dates = ({ user, locate }) => {
  const navigate = useNavigate();
  const [leuser, setLeuser] = useState({});
  const [date, setDate] = useState({});
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

                // console.log(response.data.uti);
                // var premier = response.data.uti.premier;
                // var second = response.data.uti.second;
                // const recup = await axios.get(UserProfile, 
                //     {
                //         params: {
                //             myString : premier
                //         }
                //     })
                //     setTab(tab.concat(recup.data.uti))
                //     console.log(tab)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[leuser])
    
    return (
        
        <div className="app-page">      
         
        <div className="dates">
        <h2>La liste de vos dates</h2>
      </div>
    </div>
  );
};

export default Dates;
