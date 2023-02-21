import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { userRoute } from "./utils/APIRoutes";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  const [user, setUser] = useState(undefined);
  const [done, setDone] = useState(undefined);
  const dataFetchedRef = useRef(false);

  // GET USER DATA
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  }, []);

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
        // CONNEXION RÉUSSIE.
        setUser(data.user);
      }
    }

    setDone(true);
  };

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
          <footer></footer>
        </>
      )}
    </div>
  );
}

export default App;
