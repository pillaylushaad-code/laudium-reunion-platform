import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import StudentContext from "../../context/StudentContext";
import { mapStudentFromDatabase } from "../../context/StudentContext";
import "./LoginPage.css";

function LoginPage() {
  const [reunionCode, setReunionCode] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setLoggedInStudent, setIsCommitteeMember } =
    useContext(StudentContext);

  async function handleLogin(event) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const formattedCode = reunionCode.trim().toUpperCase();

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-auth`;

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          reunionCode: formattedCode,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "Unable to log in.");
        return;
      }

      const { session, student, isCommitteeMember } = result;

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (sessionError) {
        console.error("Failed to establish session:", sessionError);

        setErrorMessage("Unable to establish your session.");
        return;
      }

      setLoggedInStudent(mapStudentFromDatabase(student));
      setIsCommitteeMember(isCommitteeMember);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage("Unable to connect to the reunion server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <h1>Student Login</h1>

      <p>
        Enter your reunion code and password to continue. If this is your first
        time, the password you enter will become your account password.
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Reunion Code"
          value={reunionCode}
          onChange={(event) => setReunionCode(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {errorMessage && <p className="login-error">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Continue"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
