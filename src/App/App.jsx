import { Routes, Route } from "react-router-dom";

import WelcomePage from "../pages/WelcomePage/WelcomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import CreateProfilePage from "../pages/CreateProfilePage/CreateProfilePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import QuizPage from "../pages/QuizPage/QuizPage";
import StudentDirectoryPage from "../pages/StudentDirectory/StudentDirectoryPage";
import PhotoGalleryPage from "../pages/PhotoGallery/PhotoGalleryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-profile" element={<CreateProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/student-directory" element={<StudentDirectoryPage />} />
      <Route path="/photo-gallery" element={<PhotoGalleryPage />} />
    </Routes>
  );
}

export default App;
