import { useNavigate } from "react-router-dom";
import { userSwipe } from "../utils/APIRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader_transition from "../components/Loading";
const Swipe = ({ user, setLocate }) => {
  const [swip, setSwip] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch_data();
  }, []);

  const fetch_data = async () => {
    // note a moi meme :
    // premier log, je chope genre 20 user, a chaque fois que j'arrives a 10 user de swipe, je refetch 10 user différents...
    // dans le fetch (server) il faut vérifier si l'utilisateur n'as pas déja des matchs avec ces personnes la.
    try {
      const response = await axios.get(userSwipe);
      setSwip(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const swp = (side) => {
    setTransition(side);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setTransition("");
    }, 500);
  };

  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <>
          <div className="swipe-container">
            <div
              className={"card " + transition}
              onClick={() => {
                setLocate("/swipe");
                navigate("/user-profile/" + swip[currentIndex]._id);
              }}
            >
              <img src={swip[currentIndex].pdp} alt="" />
            </div>
            <div class="button-container">
              <div class="button" id="left" onClick={() => swp("swipe_left")}>
                <img src="./img/cross.png" alt="" />
              </div>
              <div class="button" id="right" onClick={() => swp("swipe_right")}>
                <img src="./img/check.png" alt="" />
              </div>
            </div>
            <div className="user-presentation">
              <h1>
                {swip[currentIndex].fistname + " " + swip[currentIndex].name}{" "}
              </h1>
              <h2>{swip[currentIndex].age} - 25 km</h2>
              <p>{swip[currentIndex].description}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Swipe;
