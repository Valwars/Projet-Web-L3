import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { userRoute } from "../utils/APIRoutes";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);


const UserProfile = ({user,locate}) => {
    const navigate = useNavigate();
    
    const data = {
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
      {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
      ],
      };
 
      
    return(
        <div className="app-page">
        <div className="profile-content">
         
  
          <div className="user-data">
            <img className="pdp" src={user.pdp} alt="" />
            <h1>{user.name+ " " + user.firstname}</h1>
            <h2>{user.age + " ans - " + user.localisation}</h2>
            <p>{user.description}</p>
          </div>
          <div className="user-pics">
            <h2>Photos :</h2>
            <div className="pics-container">
              {user.photos.map((photo) => {
                return (
                  <div className="pic">
                    <img src={photo} alt="" />
                  </div>
                );
              })}


            </div>            
          </div>

          <div className="user-statistic">           
            <h2>Intérêts : </h2>
            <ul className="interet"> {user.interests.map((inte) => {
             return(
                 <li>{inte}</li>
             )
    
              })}</ul>
            <Pie data={data}/>
           
          </div>
        </div>
      </div>
    )
}

export default UserProfile;