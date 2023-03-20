import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { userRoute } from "../utils/APIRoutes";

const Swipe = ({ user, setLocate }) => {

  const navigate = useNavigate();
  $(async function(){
    const data = await window.fetch(userRoute);
   const jason = await data.json();
  })

  
  return (
    <div className="app-page">
      <div className="swipe-container">
        <div
          className="card"
          onClick={() => {
            setLocate("/swipe");
            navigate("/user-profile?i=2");
          }}
        >
          <img
            src="https://xsgames.co/randomusers/avatar.php?g=female"
            alt=""
          />
        </div>
        <div class="button-container">
          <div class="button" id="left">
            <img src="./img/cross.png" alt="" />
          </div>
          <div class="button" id="right">
            <img src="./img/check.png" alt="" />
          </div>
        </div>
        <div className="user-presentation">
          <h1>Jane Cooper</h1>
          <h2>20 ans - 25 km</h2>
          <p>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Swipe;
