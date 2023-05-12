import { useNavigate } from "react-router-dom";
import { userSwipe } from "../utils/APIRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader_transition from "../components/Loading";
import { Client } from "@googlemaps/google-maps-services-js";

const Swipe = ({ user, setLocate }) => {
  const [swip, setSwip] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState("");
  const [distance, setDistance] = useState(null);

  
  
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if ((currentIndex)%5 ==0){
      fetch_data();
    }
    
  }, [currentIndex]);

  const fetch_data = async () => {
    // note a moi meme :
    // premier log, je chope genre 20 user, a chaque fois que j'arrives a 10 user de swipe, je refetch 10 user différents...
    // dans le fetch (server) il faut vérifier si l'utilisateur n'as pas déja des matchs avec ces personnes la.
    try {
      const response = await axios.get(userSwipe, {
        params: {
          currentIndex: currentIndex
        }
      });
      console.log(currentIndex)
      console.log(response.data)
      var ajout = swip.concat(response.data);
      setSwip(prevTab => [...prevTab , ...ajout]);
      
      
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const swp = (side) => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    console.log(currentIndex)
    setTransition(side);
    setTimeout(() => {
      setSwip(swip.slice(0, -1));
      setTransition("");
    }, 500);
  };

  const topCard = swip.length > 0 ? swip[swip.length - 1] : null;

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
          address: topCard.localisation,
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
  }, [swip]);

  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <>
          <div className="swipe-container">
            <Card
              item={topCard}
              transition={transition}
              setLocate={setLocate}
              navigate={navigate}
            />

            <div class="button-container">
              <div class="button" id="left" onClick={() => swp("swipe_left")}>
                <img src="./img/cross.png" alt="" />
              </div>
              <div class="button" id="right" onClick={() => swp("swipe_right")}>
                <img src="./img/check.png" alt="" />
              </div>
            </div>
            {topCard ? (
              <div className="user-presentation">
                <h1>{topCard.fistname + " " + topCard.name} </h1>
                <h2>
                  {topCard.age + " ans"} - {distance}
                </h2>
                <p>{topCard.description}</p>
              </div>
            ) : (
              <h1>Vous n'avez plus de profils à visiter.</h1>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Card = ({ item, transition, setLocate, navigate }) => {
  return (
    <div
      className={"card " + transition}
      onClick={() => {
        setLocate("/swipe");
        navigate("/user-profile/" + item._id);
      }}
    >
      <img src={item.pdp} alt="" />
    </div>
  );
};

export default Swipe;
