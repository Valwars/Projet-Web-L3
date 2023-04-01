import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { userRoute } from "../utils/APIRoutes";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);


const UserProfile = ({user,locate}) => {
    const navigate = useNavigate();

    

    const [nombre_match, setnombre_match ] = useState([
      { date: "10/02/2021", count: 0 },
      { date: "11/02/2021", count: 1 },
      { date: "17/02/2021", count: 2 },
      { date: "10/03/2021", count: 3 }
    ]);
    
    const [nombre_conversation, setConversation] = useState([
      { date: "11/02/2021", count: 0 },
      { date: "17/02/2021", count: 1 },
      { date: "10/03/2021", count: 2 }
    ]);
    
    const [nombre_date, setnombre_date ] = useState([
      { date: "10/02/2021", count: 0 },
      { date: "11/02/2021", count: 1 },
      { date: "17/02/2021", count: 2 },
      { date: "10/03/2021", count: 3 }
    ]);
    
    const [e, s ] = useState([
      { date: "10/02/2021", count: 0 },
      { date: "11/02/2021", count: 1 },
      { date: "17/02/2021", count: 2 },
      { date: "10/03/2021", count: 3 }
    ]);
    
    const data_match = {
      labels: nombre_match.map((item) => item.date),
      datasets: [
        {
          label: "Nombre de matchs depuis votre inscription",
          data: nombre_match.map((item) => item.count),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    };

    
    const data_conversation = {
      labels: nombre_conversation.map((item) => item.date),
      datasets: [
        {
          label: "Nombre de conversations depuis votre inscription",
          data: nombre_conversation.map((item) => item.count),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    };
    
    const data_date = {
      labels: nombre_date.map((item) => item.date),
      datasets: [
        {
          label: "Nombre de dates depuis votre inscription",
          data: nombre_date.map((item) => item.count),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    };
    
    const options_stat = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart',
        },
      },
      scales: {
        y:
          {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 1,
            },
          },
        x:
          {
            type: 'time',
            time: {
              tooltipFormat: 'DD/MM/YY'
            },
            title: {
              display: true,
              text: "Date",
            },        
          },
      },
    };

 
      
    return(
        <div className="app-page">
        <div className="profile-content">
         
  
          <div className="haut-profil">
            <img className="pdp" src={user.pdp} alt="" />
            <h1>{user.name+ " " + user.firstname}</h1>
      <div className="profil-information"> 
      
            <h2>{user.age + " ans - 25 km "}</h2> <span><h2>{user.orientation}</h2></span>
            
        </div>            
            <p>{user.localisation}</p>
            <p>{user.description}</p>
           
          </div>
          <div className="profil-interests">
             <h2>Vos intérêts : </h2>
            <ul className="interet"> {user.interests.map((inte) => {
             return(
                 <li>{inte}</li>
             )
    
              })}</ul>
          </div>
         

          <div className="user-pics">
          
            <h2>Vos photos :</h2>
            <div className="photos-container">
              {user.photos.map((photo) => {
                return (
                  <div className="photo">
                    <img src={photo} alt="" />
                  </div>
                );
              })}


            </div>  
            <span> <h2>Voir plus</h2> </span>          
          </div> 
<h2>Statistiques :</h2>
      <h4>Conversations</h4>
          <div className="profile-stats">           
           <div className="stat">
             <h1>10</h1> 
            <Line className="graphiques"  data={data_conversation} options={options_stat}/>
           </div>

      <h4>Matchs</h4>
           <div className="stat">
             <Line className="graphiques"  data={data_match} options={options_stat}/>
              <h1>20</h1> 
           </div>

      <h4>Dates</h4>
           <div className="stat">
             <h1>10</h1> 
            <Line className="graphiques"  data={data_date} options={options_stat}/>
           </div>
          
           
         
          
          </div>
        </div>
      </div>
    )
}

export default UserProfile;