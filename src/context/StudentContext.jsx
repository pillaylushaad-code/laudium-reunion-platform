import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const StudentContext = createContext();

export function mapStudentFromDatabase(student) {
  return {
    id: student.id,
    reunionCode: student.reunion_code,
    schoolFirstName: student.school_first_name,
    schoolSurname: student.school_surname,
    class: student.class,

    currentFirstName: student.current_first_name,
    currentSurname: student.current_surname,
    profilePhoto: student.profile_photo,
    occupation: student.occupation,
    bio: student.bio,
    lifeMotto: student.life_motto,

    facebook: student.facebook,
    instagram: student.instagram,
    linkedin: student.linkedin,

    businessName: student.business_name,
    businessDescription: student.business_description,
    businessLink: student.business_link,

    profileCompleted: student.profile_completed,
    quizResult: student.quiz_result,

    createdAt: student.created_at,
    updatedAt: student.updated_at,
  };
}

function mapStudentToDatabase(updatedDetails) {
  const databaseDetails = {};

  if ("currentFirstName" in updatedDetails) {
    databaseDetails.current_first_name =
      updatedDetails.currentFirstName;
  }

  if ("currentSurname" in updatedDetails) {
    databaseDetails.current_surname =
      updatedDetails.currentSurname;
  }

  if ("profilePhoto" in updatedDetails) {
    databaseDetails.profile_photo =
      updatedDetails.profilePhoto;
  }

  if ("occupation" in updatedDetails) {
    databaseDetails.occupation =
      updatedDetails.occupation;
  }

  if ("bio" in updatedDetails) {
    databaseDetails.bio =
      updatedDetails.bio;
  }

  if ("lifeMotto" in updatedDetails) {
    databaseDetails.life_motto =
      updatedDetails.lifeMotto;
  }

  if ("facebook" in updatedDetails) {
    databaseDetails.facebook =
      updatedDetails.facebook;
  }

  if ("instagram" in updatedDetails) {
    databaseDetails.instagram =
      updatedDetails.instagram;
  }

  if ("linkedin" in updatedDetails) {
    databaseDetails.linkedin =
      updatedDetails.linkedin;
  }

  if ("businessName" in updatedDetails) {
    databaseDetails.business_name =
      updatedDetails.businessName;
  }

  if ("businessDescription" in updatedDetails) {
    databaseDetails.business_description =
      updatedDetails.businessDescription;
  }

  if ("businessLink" in updatedDetails) {
    databaseDetails.business_link =
      updatedDetails.businessLink;
  }

  if ("profileCompleted" in updatedDetails) {
    databaseDetails.profile_completed =
      updatedDetails.profileCompleted;
  }

  if ("quizResult" in updatedDetails) {
    databaseDetails.quiz_result =
      updatedDetails.quizResult;
  }

  return databaseDetails;
}

function StudentProvider({ children }) {
  const [studentList, setStudentList] = useState([]);
  const [loggedInStudent, setLoggedInStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCommitteeMember, setIsCommitteeMember] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("reunion_code");

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          "Failed to load students:",
          error
        );

        setStudentError(error.message);
        setStudentList([]);
        setLoadingStudents(false);

        return;
      }

      setStudentList(
        data.map(mapStudentFromDatabase)
      );

      setStudentError(null);
      setLoadingStudents(false);
    }

    async function loadLoggedInStudent(session) {
      if (!session?.user) {
        if (mounted) {
          setLoggedInStudent(null);
          setIsCommitteeMember(false);
          setAuthLoading(false);
        }

        return;
      }

      const {
        data: student,
        error,
      } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!mounted) {
        return;
      }

      if (error || !student) {
        console.error(
          "Failed to restore student:",
          error
        );

        setLoggedInStudent(null);
        setIsCommitteeMember(false);
        setAuthLoading(false);

        return;
      }

      setLoggedInStudent(
        mapStudentFromDatabase(student)
      );

      const committeeStatus =
        session.user.app_metadata
          ?.is_committee_member === true;

      setIsCommitteeMember(committeeStatus);
      setAuthLoading(false);
    }

    async function initialize() {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          "Failed to restore session:",
          error
        );

        setAuthLoading(false);
        setLoadingStudents(false);

        return;
      }

      await loadLoggedInStudent(data.session);

      /*
       * The students table can only be read by authenticated users.
       * Therefore the directory is loaded only after the session
       * has been restored.
       */
      if (data.session?.user) {
        await loadStudents();
      } else {
        setLoadingStudents(false);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) {
          return;
        }

        if (event === "SIGNED_OUT") {
          setLoggedInStudent(null);
          setIsCommitteeMember(false);
          setStudentList([]);
          setStudentError(null);
          setLoadingStudents(false);
          setAuthLoading(false);

          return;
        }

        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"
        ) {
          await loadLoggedInStudent(session);

          if (session?.user) {
            await loadStudents();
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function updateStudent(updatedDetails) {
    if (!loggedInStudent) {
      return {
        success: false,
        error: "No student is currently logged in.",
      };
    }

    const databaseDetails =
      mapStudentToDatabase(updatedDetails);

    const {
      data,
      error,
    } = await supabase
      .from("students")
      .update(databaseDetails)
      .eq("id", loggedInStudent.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Failed to update student:",
        error
      );

      return {
        success: false,
        error: error.message,
      };
    }

    const updatedStudent =
      mapStudentFromDatabase(data);

    setLoggedInStudent(updatedStudent);

    setStudentList((currentStudents) =>
      currentStudents.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      )
    );

    return {
      success: true,
      student: updatedStudent,
    };
  }

  return (
    <StudentContext.Provider
      value={{
        studentList,
        loggedInStudent,
        setLoggedInStudent,
        updateStudent,
        loadingStudents,
        studentError,
        authLoading,
        isCommitteeMember,
        setIsCommitteeMember,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export { StudentProvider };
export default StudentContext;