import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader_transition from "../components/Loading";
import { deleteR, getImage, match } from "../utils/APIRoutes";
import axios from "axios";

const Matchs = ({ user, setLocate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matchs, setMatch] = useState([]);
  const [searsh, setSearsh] = useState("");
  const [sort, setSort] = useState(1);

  useEffect(() => {
    fetch_data();
  }, [searsh, sort]);
  const fetch_data = async () => {
    try {
      const response = await axios.get(match, {
        params: {
          currentuser: user._id,
          searchString: searsh,
          order: sort,
        },
      });
      console.log(response.data.status);
      setMatch(response.data.match);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // const matchs = [
  //   {
  //     id: "23",
  //     nom: "Jane",
  //     prenom: "Cooper",
  //     pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
  //   },
  //   {
  //     id: "23",
  //     nom: "Jane",
  //     prenom: "Cooper",
  //     pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
  //   },
  //   {
  //     id: "23",
  //     nom: "Jane",
  //     prenom: "Cooper",
  //     pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
  //   },
  //   {
  //     id: "23",
  //     nom: "Jane",
  //     prenom: "Cooper",
  //     pdp: "https://xsgames.co/randomusers/avatar.php?g=female",
  //   },
  // ];
  const handle_sort = (e) => {
    document
      .getElementsByClassName("filter-order-active")[0]
      .classList.remove("filter-order-active");
    e.target.classList.add("filter-order-active");
  };

  const delete_document = async (item) => {
    const result = await axios.post(deleteR, {
      collection: "Matchs",
      user2: item._id,
      user1: user._id,
    });

    if (result.data.status === "ok") {
      setMatch(matchs.filter((i) => i._id !== item._id));
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    delete_document(item);
  };

  return (
    <div className="app-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="match-content">
          <div className="top">
            <h1>Vos matchs</h1>
            <div className="order-filters">
              <i
                className="fa fa-chevron-down filter-order-active"
                onClick={(e) => {
                  handle_sort(e);
                  setSort(1);
                }}
              ></i>

              <i
                className="fa fa-chevron-up"
                onClick={(e) => {
                  handle_sort(e);
                  setSort(-1);
                }}
              ></i>
            </div>
            <input
              id="convtp"
              type="text"
              placeholder="Rechercher..."
              onChange={(e) => setSearsh(e.target.value)}
            />{" "}
          </div>
          {matchs.length == 0 ? (
            <>
              <div className="no_conv">
                {searsh.length > 0 ? (
                  <h2>Pas de résulats correspondants !</h2>
                ) : (
                  <h2>Tu n'as pas encore de matchs !</h2>
                )}
              </div>
            </>
          ) : (
            <div className="matchs-container">
              {matchs.map((match) => {
                return (
                  <div
                    onContextMenu={(e) => handleContextMenu(e, match)}
                    className="match"
                    onClick={() => {
                      setLocate("/match");
                      navigate("/user-profile/" + match._id);
                    }}
                  >
                    <img src={getImage + match.pdp} alt="" />
                    <h2>{match.name + " " + match.firstname}</h2>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Matchs;
