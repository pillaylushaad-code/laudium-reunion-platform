import "./DashboardPage.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import StudentContext from "../../context/StudentContext";
import { supabase } from "../../lib/supabase";

function DashboardPage() {
  const { loggedInStudent, authLoading } = useContext(StudentContext);

  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    navigate("/login", { replace: true });
  }

  if (authLoading) {
    return (
      <main className="dashboard-page">
        <p>Loading your reunion journey...</p>
      </main>
    );
  }

  if (!loggedInStudent) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="dashboard-page">
      <h1>Salutations, {loggedInStudent.schoolFirstName}</h1>

      <p>Welcome to your 2013 Reunion Journey.</p>

      <button className="dashboard-logout-button" onClick={handleLogout}>
        Log Out
      </button>

      <section className="journey-section">
        <h2>Your Reunion Journey</h2>

        <p>
          Continue your journey by completing the chapters below. You can leave
          and return at any time.
        </p>

        <div className="journey-card">
          {loggedInStudent.profileCompleted ? (
            <>
              <h3>My Profile</h3>

              <p>
                View your reunion profile and make changes whenever you need to.
              </p>

              <button onClick={() => navigate("/profile")}>
                View My Profile
              </button>
            </>
          ) : (
            <>
              <h3>Create Your Profile</h3>

              <p>
                Tell your classmates who you are today while preserving your
                school identity.
              </p>

              <button onClick={() => navigate("/create-profile")}>Begin</button>
            </>
          )}
        </div>

        <div className="journey-card">
          <h3>Reunion Quiz</h3>

          {loggedInStudent.quizResult ? (
            <p>
              ✓ Quiz Completed — Score: {loggedInStudent.quizResult.score} /{" "}
              {loggedInStudent.quizResult.totalQuestions}
            </p>
          ) : (
            <p>Not completed</p>
          )}

          <p>
            Test your memory and see how much you remember from your school
            days.
          </p>

          <button onClick={() => navigate("/quiz")}>
            {loggedInStudent.quizResult ? "View Results" : "Begin Quiz"}
          </button>
        </div>

        <div className="journey-card">
          <h3>Photo Gallery</h3>

          <p>Share and explore memories from our school years</p>

          <button onClick={() => navigate("/photo-gallery")}>
            View Gallery
          </button>
        </div>

        <div className="journey-card">
          <h3>Student Directory</h3>

          <p>
            See your former classmates and discover where life has taken them.
          </p>

          <button onClick={() => navigate("/student-directory")}>
            View Directory
          </button>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
