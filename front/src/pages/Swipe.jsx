import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { userSwipe } from "../utils/APIRoutes";
import axios from "axios";
import { useEffect, useState } from "react";

const Swipe = ({ user, setLocate }) => {
  const [swip, setSwip] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  var nbs = 0;
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(userSwipe);
        setSwip(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  console.log(swip);

  const swp = (e) => {
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <>
      {swip.length > 0 && currentIndex < swip.length ? (
        <div className="app-page">
          <div className="swipe-container">
            <div
              className="card"
              onClick={() => {
                setLocate("/swipe");
                navigate("/user-profile/" + swip[currentIndex]._id);
              }}
            >
              <img src={swip[currentIndex].pdp} alt="" />
            </div>
            <div class="button-container">
              <div class="button" id="left" onClick={swp}>
                <img src="./img/cross.png" alt="" />
              </div>
              <div class="button" id="right" onClick={swp}>
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
        </div>
      ) : (
        <div className="app-page">
          <div className="swipe-container">
            <div
              className="card"
              onClick={() => {
                setLocate("/swipe");
                navigate("/user-profile");
              }}
            >
              {/* <h1>Plus personne pour toi man</h1> */}
            </div>
            <div class="button-container">
              <div class="button" id="left">
                <img src="./img/cross.png" alt="" onClick={swp} />
              </div>
              <div class="button" id="right">
                <img src="./img/check.png" alt="" onClick={swp} />
              </div>
            </div>
            <div className="user-presentation">
              <h1>" " </h1>
              <h2> - 25 km</h2>
              <p></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Swipe;
