import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CareerAssessmentPage from "./pages/CareerAssessmentPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyAccountPage from "./pages/MyAccountPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import ExamTrainingPage from "./pages/ExamTrainingPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import StudyAbroadPage from "./pages/StudyAbroadPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about/company-profile" element={<CompanyProfilePage />} />
          <Route path="/study-abroad/:country" element={<StudyAbroadPage />} />
          <Route
            path="/career-assessment/behaviour-and-career-analysis"
            element={<CareerAssessmentPage />}
          />
          <Route path="/exam-training" element={<ExamTrainingPage />} />
          <Route path="/exam-training/:exam" element={<ExamDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<Navigate to="/about/company-profile" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
