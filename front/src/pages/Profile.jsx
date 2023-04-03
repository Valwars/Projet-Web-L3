import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { userRoute } from "../utils/APIRoutes";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = ({ user_id, locate }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ photos: [], interests: [] });

  const { token } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(userRoute, {
          params: {
            myString: token,
          },
        });
        console.log(response.data.uti);
        console.log(response.data.message);
        if (response.data.message) {
          var u = response.data.uti;
          setProfile(u);
          console.log(profile);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate, token, locate]);

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
          <h1>{profile.name + " " + profile.fistname}</h1>
          <h2>{profile.age + " ans - " + profile.localisation}</h2>
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

            <ul>
              {profile.interests.map((inte) => {
                return <li>{inte}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
