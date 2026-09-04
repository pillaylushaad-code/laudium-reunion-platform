import { Link } from "react-router-dom";
import schoolCrest from "../../assets/school-crest.png";
import reunionFlyer from "../../assets/reunion-flyer.png";
import "./WelcomePage.css";

function WelcomePage() {
  return (
    <main className="welcome-page">
      <section className="welcome-content">
        <img
          className="school-crest"
          src={schoolCrest}
          alt="Laudium Secondary School Crest"
        />

        <h2 className="class-title">
          Class of 2013
        </h2>

        <h1 className="welcome-title">
          Back to School
        </h1>

        <p className="welcome-tagline">
          A celebration of how far we have come and how far we are yet to go.
        </p>

        <p className="welcome-description">
          Welcome back. Thirteen years ago we walked these halls together.
          Now it's time to reconnect, reflect and celebrate the journeys
          that have shaped us.
        </p>

        <Link className="begin-btn" to="/login">
          Begin Journey
        </Link>
      </section>

      <section className="welcome-flyer-section">
        <p className="welcome-flyer-label">
          Class of 2013 Reunion
        </p>

        <img
          className="welcome-flyer"
          src={reunionFlyer}
          alt="Laudium Secondary School Class of 2013 Reunion flyer"
        />
      </section>
    </main>
  );
}

export default WelcomePage;