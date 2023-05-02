import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { userRoute } from "../utils/APIRoutes";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Client } from "@googlemaps/google-maps-services-js";
import Loader_transition from "../components/Loading";

const Profile = ({ user, user_id, locate }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(undefined);
  const [distance, setDistance] = useState(null);
  const { token } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(userRoute, {
          params: {
            myString: token,
          },
        });

        console.log(response.data);
        setProfile(response.data.uti);
        getDistance(user, response.data.uti.localisation);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate, token, locate]);

  const formatDistance = (distanceInKm) => {
    const distanceInMeters = distanceInKm * 1000;
    if (distanceInMeters < 1000) {
      return `${distanceInMeters.toFixed(2)} m`;
    }
    return `${distanceInKm.toFixed(2)} km`;
  };

  const getDistance = async (user, l) => {
    const client = new Client({});
    try {
      const response1 = await client.geocode({
        params: {
          address: user.localisation,
          key: "AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs",
        },
      });

      const response2 = await client.geocode({
        params: {
          address: l,
          key: "AIzaSyC1p-dG6m6l-oTrsuCansySfat8R7N0yHs",
        },
      });

      const lat1 = response1.data.results[0].geometry.location.lat;
      const lng1 = response1.data.results[0].geometry.location.lng;
      const lat2 = response2.data.results[0].geometry.location.lat;
      const lng2 = response2.data.results[0].geometry.location.lng;

      const R = 6371; // Rayon de la Terre en km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance en km
      const formattedDistance = formatDistance(d);
      setDistance(formattedDistance);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
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
            <h2>{profile.age + " ans - " + distance}</h2>
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
      )}
    </div>
  );
};

export default Profile;
