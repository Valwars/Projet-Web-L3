import "./style.css";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="nav">
      <div className="content">
        <div className="logout-container">
          <i className="fas fa-sign-out-alt"></i>
        </div>
        <div className="pdp-container">
          <img src="https://xsgames.co/randomusers/avatar.php?g=male" alt="" />
        </div>
        <div className="menu-items-container">
          <ul>
            <CustomLink to="/">
              <span>
                <i className="fas fa-heart"></i>
              </span>
              Swipe
            </CustomLink>

            <CustomLink to="/match">
              <span>
                <i className="fas fa-kiss-wink-heart"></i>
              </span>
              Match
            </CustomLink>
            <CustomLink to="/messages">
              <span>
                <i className="fab fa-facebook-messenger"></i>
              </span>
              Chat
            </CustomLink>
            <CustomLink to="/map">
              <span>
                <i className="fas fa-map-marker-alt"></i>
              </span>
              Map
            </CustomLink>
            <CustomLink to="/profile">
              <span>
                <i className="fas fa-user-alt"></i>
              </span>
              Profile
            </CustomLink>
          </ul>
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
