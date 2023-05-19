import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { getImage, userRoute, createConv } from "../utils/APIRoutes";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Client } from "@googlemaps/google-maps-services-js";
import Loader_transition from "../components/Loading";
import PopupDate from "../components/popupDate/PopupDate";

const Profile = ({ user, locate }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(undefined);
  const [distance, setDistance] = useState(null);
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [photosLimit, setPhotosLimit] = useState(3); // Limite de photos affichées

  const [showpop, setShowPop] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(userRoute, {
          params: {
            myString: token,
          },
        });
        if (response.data.status === "ok") {
          console.log(response.data);
          setProfile(response.data.uti);
          console.log(response.data.uti.interests);
          setLoading(false);
        }
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

  const getDistance = async () => {
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
          address: profile.localisation,
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

  useEffect(() => {
    getDistance();
  }, [profile]);

  const create_conv = async () => {
    const val = { user1: user._id, user2: token };
    console.log(val);
    try {
      const response = await axios.post(createConv, val);

      if (response.data.status === "ok") {
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    if (locate === "/match") {
      navigate("/matchs");
    } else {
      navigate("/");
    }
  };
  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="profile-content">
          {showpop ? (
            <>
              {" "}
              <PopupDate user={user}></PopupDate>{" "}
            </>
          ) : (
            <></>
          )}
          <div className="inputs-container">
            <button onClick={() => handleBack()}>Retour</button>
            {locate === "/match" ? (
              <div className="btn-cont">
                <button
                  onClick={() => {
                    create_conv();
                  }}
                >
                  Discuter
                </button>
                <button onClick={() => setShowPop(!showpop)}>
                  {" "}
                  {!showpop ? "Date !" : "Annuler"}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="user-data">
            <img className="pdp" src={getImage + profile.pdp} alt="" />
            <h1>{profile.name + " " + profile.firstname}</h1>
            <div className="profil-information">
              <h2>{profile.age + " ans - " + distance}</h2>
              <span>
                <h2>{user.orientation}</h2>
              </span>
            </div>
            <p>{profile.description}</p>

            <div className="interests">
              {profile.interests.map((inte) => {
                return <h2>{inte}</h2>;
              })}
            </div>
          </div>
          <div className="user-pics">
            <h2>Photos :</h2>
            <div className="pics-container">
              {profile.photos.slice(0, photosLimit).map((photo) => {
                return (
                  <div className="pic">
                    <img src={getImage + photo} alt="" />
                  </div>
                );
              })}
            </div>{" "}
            {photosLimit == 6 ? (
              <></>
            ) : (
              <button
                className="showmorepics"
                onClick={() => setPhotosLimit(photosLimit + 3)}
              >
                Voir plus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
