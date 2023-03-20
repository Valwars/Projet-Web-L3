import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Profile = ({ user_id, locate }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    nom: "Jane",
    prenom: "Cooper",
    age: 20,
    adress: "2 Rue des Pavillons 81000 Albi France",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
    photos: [
      "https://xsgames.co/randomusers/avatar.php?g=female",
      "https://xsgames.co/randomusers/avatar.php?g=female",
      "https://xsgames.co/randomusers/avatar.php?g=female",
      "https://xsgames.co/randomusers/avatar.php?g=female",
    ],
  });

  return (
    <div className="app-page">
      <div className="profile-content"> 
        <div className="inputs-container">
          <button onClick={() => navigate("/")}>Retour</button>
          {locate === "/match" ? (
            <div className="btn-cont">
              <button>Discuter</button>
              <button>Date !</button>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="user-data">
          <img className="pdp" src={profile.pdp} alt="" />
          <h1>{profile.nom + " " + profile.prenom}</h1>
          <h2>{profile.age + " ans - " + profile.adress}</h2>
          <p>{profile.description}</p>
        </div>
        <div className="user-pics">
          <h2>Photos :</h2>
          <div className="pics-container">
            {profile.photos.map((photo) => {
              return (
                <div className="pic">
                  <img src={photo} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
