import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { datesRoute } from "../utils/APIRoutes";
const Dates = ({user,locate}) => {
    const navigate = useNavigate();    
   const [leuser, setLeuser] = useState({});
   
   useEffect(()=> {
     setLeuser(user)
        const fetchData = async (event) => {
            event.preventDefault();
           console.log(leuser);
            try {
                const response = await axios.get(datesRoute, {
                    user: leuser
                });

                // console.log(response)

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
   
    )
}

export default Dates;