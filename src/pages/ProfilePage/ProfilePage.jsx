import "./ProfilePage.css";
import { useContext } from "react";
import StudentContext from "../../context/StudentContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function ProfilePage() {
  const { loggedInStudent, authLoading } = useContext(StudentContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedStudent = location.state?.student;
  const profileStudent = selectedStudent || loggedInStudent;

if (authLoading) {
  return (
    <main className="profile-page">
      <p>Loading your reunion profile...</p>
    </main>
  );
}

if (!loggedInStudent) {
  return <Navigate to="/login" replace />;
}

  return (
    <main className="profile-page">
      <h1>
        {profileStudent === loggedInStudent
          ? "My Reunion Profile"
          : "Classmate Profile"}
      </h1>

      <section className="profile-header">
        {profileStudent.profilePhoto && (
          <img src={profileStudent.profilePhoto} alt="Profile" width="200" />
        )}

        <h2>
          {profileStudent.currentFirstName || profileStudent.schoolFirstName}{" "}
          {profileStudent.currentSurname || profileStudent.schoolSurname}
        </h2>

        <p>Class of 2013 · {profileStudent.class}</p>

        {profileStudent.occupation && <p>{profileStudent.occupation}</p>}

        {profileStudent === loggedInStudent && (
          <button onClick={() => navigate("/create-profile")}>
            Edit Profile
          </button>
        )}

        <button
          onClick={() =>
            navigate(
              profileStudent === loggedInStudent
                ? "/dashboard"
                : "/student-directory",
            )
          }
        >
          {profileStudent === loggedInStudent
            ? "Back to Dashboard"
            : "Back to Directory"}
        </button>
      </section>

      {!profileStudent.profileCompleted && (
        <p>This classmate has not completed their reunion profile yet.</p>
      )}

      {(profileStudent.bio || profileStudent.lifeMotto) && (
        <section className="personal-information">
          <h2>About Me</h2>

          {profileStudent.bio && <p>{profileStudent.bio}</p>}

          {profileStudent.lifeMotto && (
            <>
              <h3>Life Motto</h3>

              <blockquote>"{profileStudent.lifeMotto}"</blockquote>
            </>
          )}
        </section>
      )}

      {(profileStudent.facebook ||
        profileStudent.instagram ||
        profileStudent.linkedin) && (
        <section className="social-information">
          <h2>Connect</h2>

          {profileStudent.facebook && (
            <p>
              <a
                href={profileStudent.facebook}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </p>
          )}

          {profileStudent.instagram && (
            <p>
              <a
                href={profileStudent.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </p>
          )}

          {profileStudent.linkedin && (
            <p>
              <a
                href={profileStudent.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </p>
          )}
        </section>
      )}

      {profileStudent.quizResult && (
        <section className="quiz-results">
          <h2>Reunion Quiz</h2>

          <p>
            <strong>
              {profileStudent.quizResult.score} /{" "}
              {profileStudent.quizResult.totalQuestions}
            </strong>
          </p>

          <p>{profileStudent.quizResult.percentage}%</p>

          <h3>Category Scores</h3>

          <ul>
            {Object.keys(profileStudent.quizResult.categoryTotals).map(
              (category) => (
                <li key={category}>
                  {category}:{" "}
                  {profileStudent.quizResult.categoryScores[category] || 0} /{" "}
                  {profileStudent.quizResult.categoryTotals[category]}
                </li>
              ),
            )}
          </ul>
        </section>
      )}

      
    </main>
  );
}

export default ProfilePage;
