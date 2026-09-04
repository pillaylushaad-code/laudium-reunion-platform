import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StudentContext from "../../context/StudentContext";
import "./StudentDirectoryPage.css";

function StudentDirectoryPage() {
  const navigate = useNavigate();

  const {
    studentList,
    loggedInStudent,
    authLoading,
  } = useContext(StudentContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  if (authLoading) {
    return (
      <main className="student-directory-page">
        <p>Loading student directory...</p>
      </main>
    );
  }

  if (!loggedInStudent) {
    return <Navigate to="/login" replace />;
  }

  const classes = [
    ...new Set(studentList.map((student) => student.class)),
  ];

  const filteredStudents = studentList.filter((student) => {
    const firstName =
      student.currentFirstName || student.schoolFirstName;

    const surname =
      student.currentSurname || student.schoolSurname;

    const fullName = `${firstName} ${surname}`.toLowerCase();

    const matchesSearch = fullName.includes(
      searchTerm.toLowerCase(),
    );

    const matchesClass =
      selectedClass === "all" ||
      student.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <main className="student-directory-page">
      <header className="directory-header">
        <p className="directory-eyebrow">CLASS OF 2013</p>

        <h1>Student Directory</h1>

        <p className="directory-intro">
          See your former classmates and discover where life has taken them.
        </p>

        <button
          className="directory-back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <section className="directory-controls">
        <div className="directory-search">
          <label htmlFor="classmate-search">
            Search Classmates
          </label>

          <input
            id="classmate-search"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="directory-filter">
          <label htmlFor="class-filter">Class</label>

          <select
            id="class-filter"
            value={selectedClass}
            onChange={(event) =>
              setSelectedClass(event.target.value)
            }
          >
            <option value="all">All Classes</option>

            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="directory-results">
        <p>
          {filteredStudents.length}{" "}
          {filteredStudents.length === 1
            ? "classmate"
            : "classmates"}
        </p>
      </div>

      <section className="student-directory-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const firstName =
              student.currentFirstName ||
              student.schoolFirstName;

            const surname =
              student.currentSurname ||
              student.schoolSurname;

            const fullName = `${firstName} ${surname}`;

            return (
              <article
                className="student-directory-card"
                key={student.reunionCode}
              >
                <div className="directory-card-photo">
                  {student.profilePhoto ? (
                    <img
                      src={student.profilePhoto}
                      alt={`${fullName} profile`}
                    />
                  ) : (
                    <span>
                      {firstName?.charAt(0)}
                      {surname?.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="directory-card-content">
                  <p className="directory-card-class">
                    Class {student.class}
                  </p>

                  <h2>{fullName}</h2>

                  {student.occupation && (
                    <p className="directory-card-occupation">
                      {student.occupation}
                    </p>
                  )}

                  <button
                    className="directory-profile-button"
                    onClick={() =>
                      navigate("/profile", {
                        state: { student },
                      })
                    }
                  >
                    View Profile
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="directory-empty-state">
            <span>?</span>

            <h2>No classmates found</h2>

            <p>
              Try a different name or select another class.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default StudentDirectoryPage;