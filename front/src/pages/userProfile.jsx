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
          <div className="profile-stats">           
           <div className="stat">
             <h1>10</h1> 
            <Pie className="graphiques" data={data}/>
           </div>
           
           <div className="stat">
             <Pie className="graphiques" data={data}/>
              <h1>20</h1> 
           
           </div>

           <div className="stat">
             <h1>10</h1> 
            <Pie className="graphiques" data={data}/>
           </div>
          
           
         
          
          </div>
        </div>
      </div>
    )
}

export default UserProfile;