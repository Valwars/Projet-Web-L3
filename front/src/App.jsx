import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { userRoute } from "./utils/APIRoutes";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Swipe from "./pages/Swipe";
import Matchs from "./pages/Matchs";
import NavBar from "./components/navigation/NavigationBar";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Map from "./pages/Map";
import UserProfile from "./pages/userProfile";
import Dates from "./pages/Dates";
function App() {
  const [locate, setLocate] = useState("/");
  // les const de types[x, setX] = useState() :
  // x représente le nom d'une variable, setX permet de définir la variable et tout cela dans un etat react.

  //  const user -> représente l'utilisateur courant et ses données.

  const [user, setUser] = useState(undefined);
  /*const [user, setUser] = useState({  */

  //  const done -> permet de définir si l'application charge ou pas.
  const [done, setDone] = useState(true);

  //  const dataFetchedRef -> permet de vérifier que on fetch les data une seule fois.
  const dataFetchedRef = useRef(false);

  const [isDark, setIsDark] = useState(false);

  // GET USER DATA
  // userEffect permet d'exécuter du code à chaque chargement du composant, ou en fonction de si la variable
  // mis dans le ,[] est modifié ou pas.

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    //fetchData();
  }, []);

  //  const fetchData -> fonction qui récupères les données utilisateurs si il est co.
  const fetchData = async () => {
    const token = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (token) {
      const { data } = await axios.get(userRoute, {
        params: {
          token: JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          ),
        },
      });

      if (data.status === "ok") {
        // CONNEXION RÉUSSIE, on set l'user.
        setUser(data.user);
      }
    }
    // On affiche.
    setDone(true);
  };

  // Le code dans le return est le code html classique qu'affichera le composant.
  return (
    <div className="App">
      {!done ? (
        // mettre un loader.
        <></>
      ) : (
        // reste de l'application.
        <>
          {!user ? (
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>

              <Route
                path="/login"
                element={<Login setUser={setUser} />}
              ></Route>
              <Route path="/register" element={<Register></Register>}></Route>
            </Routes>
          ) : (
            <div className="app-container">
              <NavBar
                user={user}
                setIsDark={setIsDark}
                isDark={isDark}
              ></NavBar>

              <Routes>
                <Route
                  path="/"
                  element={<Swipe user={user} setLocate={setLocate}></Swipe>}
                ></Route>
                <Route
                  path="/matchs"
                  element={<Matchs user={user} setLocate={setLocate}></Matchs>}
                ></Route>

                <Route path="/chat" element={<Chat user={user}></Chat>}></Route>

                <Route
                  path="/Map"
                  element={
                    <Map user={user} locate={locate} isDark={isDark}></Map>
                  }
                ></Route>

                <Route
                  path="/user-profile/:token"
                  element={<Profile user={user} locate={locate}></Profile>}
                ></Route>

                <Route
                  path="/profile"
                  element={
                    <UserProfile user={user} locate={locate}></UserProfile>
                  }
                ></Route>
                <Route
                  path="/dates"
                  element={<Dates user={user} locate={locate}></Dates>}
                ></Route>
              </Routes>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
