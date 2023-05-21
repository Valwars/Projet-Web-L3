import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDate } from "../../utils/APIRoutes";
import "./popup.css";

const PopupDate = ({ user, setLocate }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState({
    premier: user._id,
    second: "",
    date: "",
    localisation: "",
    activite: "",
    createdAt: undefined,
  });

  useEffect(() => {
    var uriCourant = window.location.href;
    var indiceDepart = uriCourant.lastIndexOf("/") + 1;
    var indiceArrivee = uriCourant.length;
    var nomPage = uriCourant.substring(indiceDepart, indiceArrivee);
    setDate({ ...date, createdAt: new Date() });
    setDate({ ...date, second: nomPage });
    console.log(nomPage);
  });

  const ajoutDate = async (event) => {
    event.preventDefault();
    console.log(date);
    try {
      const response = await axios.post(createDate, date);
      navigate("/dates");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form action="" onSubmit={ajoutDate} id="popupform">
      <div className="fields">
        {" "}
        <label>date et heure</label>
        <input
          type="datetime-local"
          name="date"
          value={date.date}
          onChange={(e) => setDate({ ...date, date: e.target.value })}
          required="required"
        />
      </div>
      <div className="fields">
        <label>Lieux</label>
        <input
          type="text"
          name="localisation"
          value={date.localisation}
          onChange={(e) => setDate({ ...date, localisation: e.target.value })}
          required="required"
        />
      </div>
      <div className="fields">
        <label>Activité du date</label>
        <input
          type="text"
          name="activite"
          value={date.activite}
          onChange={(e) => setDate({ ...date, activite: e.target.value })}
          required="required"
        />
      </div>
      <button className="" type="submit">
        Créer le rendez-vous →
      </button>
    </form>
  );
};

export default PopupDate;
