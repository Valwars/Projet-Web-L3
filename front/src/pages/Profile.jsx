import { useState } from "react";
import { useNavigate } from "react-router-dom";

const User = ({ user, locate }) => {
  const navigate = useNavigate();

  // const [user, setuser] = useState({
  //  user
  // });

  return (
    <div className="app-page">
      <div className="user-content">
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
          <img className="pdp" src={user.pdp} alt="" />
          <h1>{user.name + " " + user.fistname}</h1>
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
      </div>
    </div>
  );
};

export default User;
