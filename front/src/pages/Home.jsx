import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const navigate = useNavigate();

  const data = {
    datasets: [
      {
        data: [200, 80, 100, 150],
        backgroundColor: ["#FF7A7A", "#7433C6", "#CD9337", "#CD326E"],
        hoverOffset: 4,
        borderColor: "#0F0F0F",
      },
    ],
  };

  return (
    <div>
      <header>
        <i class="fas fa-hand-holding-heart"></i>
        <button className="btn" onClick={() => navigate("/login")}>
          Se connecter
        </button>{" "}
      </header>
      <div className="present-text">
        <h1 className="sparkly">Sparkly</h1>
        <h1>
          Ça n’a jamais été aussi facile <span>d’aimer</span>.
        </h1>
        <p>
          Bienvenue sur notre application de rencontre, un endroit où vous
          pouvez rencontrer de nouvelles personnes intéressantes, discuter et
          peut-être trouver l'amour de votre vie.
        </p>
        <p>
          Nous sommes ravis de vous présenter cette plateforme de rencontres,
          conçue pour faciliter la connexion entre les célibataires du monde
          entier.
        </p>
        <button className="btn" onClick={() => navigate("/login")}>
          Créer un compte
        </button>{" "}
      </div>

      <div className="card-containers">
        <div className="card">
          <img src="https://xsgames.co/randomusers/avatar.php?g=male" alt="" />
        </div>
        <div className="card card-resp">
          <img
            src="https://xsgames.co/randomusers/avatar.php?g=female"
            alt=""
          />
        </div>
        <div className="card card-resp">
          <img src="https://xsgames.co/randomusers/avatar.php?g=male" alt="" />
        </div>
      </div>

      <div className="how">
        <h1>Comment ça marche ?</h1>
        <div className="bloc-container">
          <div className="bloc">
            <div className="bloc-content">
              <i className="fas fa-user-alt"></i>
              <h2>Créer un profil</h2>
              <p>
                Bienvenue sur notre application de rencontre, un endroit où vous
                pouvez rencontrer de nouvelles personnes intéressantes,
                discuter.
              </p>
            </div>
          </div>
          <div className="bloc">
            <div className="bloc-content">
              <i className="fas fa-heart"></i>
              <h2>Trouve un match</h2>
              <p>
                Bienvenue sur notre application de rencontre, un endroit où vous
                pouvez rencontrer de nouvelles personnes intéressantes,
                discuter.
              </p>
            </div>
          </div>
          <div className="bloc">
            <div className="bloc-content">
              <i className="fab fa-facebook-messenger"></i>
              <h2>Échange</h2>
              <p>
                Bienvenue sur notre application de rencontre, un endroit où vous
                pouvez rencontrer de nouvelles personnes intéressantes,
                discuter.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="text-info">
          <h1>
            Trouve ton <span>amour</span> près de chez toi !
          </h1>
          <div className="resume">
            <p>
              <span>Sparkly</span> te permet de trouver des gens avec les mêmes
              envies que toi, prêt de chez toi !
            </p>
            <p>
              Grâce à notre géolocalisation, ça n’a jamais été aussi facile de
              trouver ton amour !
            </p>
          </div>
        </div>
        <div className="img-info">
          <img src="./img/map.png" alt="" />
        </div>
      </div>

      <div className="info">
        <div className="img-info calender">
          <img src="./img/calender.png" alt="" />
        </div>
        <div className="text-info">
          <h1>
            Planifie tes <span>dates</span> comme tu le souhaite !
          </h1>
          <div className="resume">
            <p>
              Avec <span>Sparkly</span>, tu peux planifier et visualiser tes
              dates en temps réel, que ce soit avec votre agenda intégré ou avec
              la map.
            </p>
            <p>Tous les outils sont à votre disposition pour vous améliorer.</p>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="text-info">
          <h1>
            Analyse ton profil pour voir si tu est <span>attirant</span> !
          </h1>
          <div className="resume">
            <p>
              <span>Sparkly</span> propose de nombreux outils pour vous t’aider
              à améliorer ton profil et a attirer plus de personnes.
            </p>
            <p>Statistiques, graphiques... Tout est fait pour t’aider !</p>
          </div>
        </div>
        <div className="img-info">
          <Pie data={data} />
        </div>
      </div>

      <div className="trap">
        <h1 className="bigtitle">Sparkly.</h1>
        <h1>Convaincu ?</h1>
        <button className="btn" onClick={() => navigate("/login")}>
          Créer un compte
        </button>{" "}
      </div>

      <footer>
        <div className="footer-content">
          <div className="left">
            <h1>Mentions légales</h1>
            <ul>
              <li>Confidentialité</li>
              <li>Conditions d’utilisation</li>
              <li>Politique relative aux cookies</li>
              <li>Propriété intellectuelle</li>
            </ul>
          </div>
          <div className="right">
            <h1>Réseaux sociaux</h1>
            <div className="socials">
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-youtube"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
