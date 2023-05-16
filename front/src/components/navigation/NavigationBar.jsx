import "./style.css";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import DarkModeButton from "../dark_mode/toogle";
import { getImage } from "../../utils/APIRoutes";

const NavBar = ({ user, setIsDark, isDark }) => {
  return (
    <div className="nav">
      <div className="content">
        <div className="pdp-container">
          <img src={getImage + user.pdp} alt="" />
        </div>
        <div className="menu-items-container">
          <ul>
            <CustomLink to="/">
              <i className="fas fa-heart"></i>
              <span>Swipe</span>
            </CustomLink>

            <CustomLink to="/matchs">
              <i className="fas fa-kiss-wink-heart"></i>
              <span>Match </span>
            </CustomLink>
            <CustomLink to="/chat">
              <i className="fab fa-facebook-messenger"></i>

              <span>Chat</span>
            </CustomLink>
            <CustomLink to="/dates">
              <i className="fas fa-users"></i>

              <span>Dates </span>
            </CustomLink>
            <CustomLink to="/map">
              <i className="fas fa-map-marker-alt"></i>
              <span>Map</span>
            </CustomLink>
            <CustomLink to="/profile">
              <i className="fas fa-user-alt"></i>
              <span>Profile</span>
            </CustomLink>
          </ul>
        </div>
        <div className="others-btn">
          <DarkModeButton
            setIsDark={setIsDark}
            isDark={isDark}
          ></DarkModeButton>
        </div>
      </div>
    </div>
  );
};

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "selected" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default NavBar;
