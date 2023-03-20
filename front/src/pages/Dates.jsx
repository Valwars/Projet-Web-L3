import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { datesRoute } from "../utils/APIRoutes";
const Dates = ({user,locate}) => {
    const navigate = useNavigate();
    const u = user;
    $(async function(){
        console.log(u)
    const response = await axios.get(datesRoute,{
        u
    });
//    console.log(response)
    })


    return (
        
        <div className="app-page">      
         
        <div className="dates">
        <h2>La liste de vos dates</h2>
     </div>      
          </div>
   
    )
}

export default Dates;