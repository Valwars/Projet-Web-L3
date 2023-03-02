import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { userRoute } from "./utils/APIRoutes";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  // les const de types[x, setX] = useState() :
  // x représente le nom d'une variable, setX permet de définir la variable et tout cela dans un etat react.

  //  const user -> représente l'utilisateur courant et ses données.
  const [user, setUser] = useState(undefined);

  //  const done -> permet de définir si l'application charge ou pas.
  const [done, setDone] = useState(undefined);

  //  const dataFetchedRef -> permet de vérifier que on fetch les data une seule fois.
  const dataFetchedRef = useRef(false);

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
          <header></header>
          <Routes>
            {
              {
                /* <Route exact path="/" element={<Home></Home>}></Route>
<Route
  path="/User"
  element={<User_page user={user} setUser={setUser}></User_page>}
></Route>
   <Route status={404} element={<NotFound></NotFound>}></Route>
   <Route path="*" element={<NotFound></NotFound>}></Route> */
              }
            }
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
