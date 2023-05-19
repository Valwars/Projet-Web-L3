import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {createDate} from "../../utils/APIRoutes";
import "./popup.css";


const PopupDate = ({user,setLocate})=>{
const [date, setDate] = useState({
    premier:user._id,
    second :"",
    date : "",
    localisation:"",
    activite:"",
    createdAt:undefined
})

    
const ajoutDate = async (event)=>{
    event.preventDefault();
    setDate({...date, createdAt:new Date()})
    console.log(date)
    try {
        const response = await axios.post(createDate,{
            date,
        })
        
    } catch (error) {
        console.log(error)
    }
}

    return(
       <form action="" onSubmit={ajoutDate}>
        <label>date et heure</label>
        <input type="datetime-local"
        name="date"
        value={date.date}
        onChange={(e) => setDate({...date, date:e.target.value})}
        required="required"
        />

        <label>Lieux</label>
        <input type="text" 
        name="localisation"
        value={date.localisation}
        onChange={(e)=> setDate({...date, localisation: e.target.value})}
        required="required"
        />

        <label>Activité du date</label>
        <input type="text"
         name="activite"
         value={date.activite}
         onChange={(e)=> setDate({...date, activite: e.target.value})}
         required="required"
        />
       

       <button className="" type="submit">
          Créer le rendez-vous →
        </button>
       </form>
    )
}


export default PopupDate;