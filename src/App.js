import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CareerAssessmentPage from "./pages/CareerAssessmentPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyAccountPage from "./pages/MyAccountPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import ExamTrainingPage from "./pages/ExamTrainingPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import StudyAbroadPage from "./pages/StudyAbroadPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import GenericPage from "./pages/GenericPage";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgressBar from "./components/ScrollProgressBar";
import NewsFlashBanner from "./components/NewsFlashBanner";
// User Imports
import UserLayout from "./components/user/UserLayout";
import ProfilePage from "./pages/ProfilePage";
import StartJourneyPage from "./pages/StartJourneyPage";
import UserSupport from "./pages/user/UserSupport";
import UserDoubts from "./pages/user/UserDoubts";

// Admin Imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPages from "./pages/admin/AdminPages";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminMockTest from "./pages/admin/AdminMockTest";
import AdminNewsFlash from "./pages/admin/AdminNewsFlash";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";
import AdminInvoice from "./pages/admin/AdminInvoice";
import AdminDoubts from "./pages/admin/AdminDoubts";

import AdminGuides from "./pages/admin/AdminGuides";

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <NewsFlashBanner />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about/company-profile" element={<CompanyProfilePage />} />
          <Route path="/study-abroad/:country" element={<StudyAbroadPage />} />
          <Route path="/start-journey" element={<StartJourneyPage />} />
          <Route
            path="/career-assessment/behaviour-and-career-analysis"
            element={<CareerAssessmentPage />}
          />
          <Route path="/exam-training" element={<ExamTrainingPage />} />
          <Route path="/exam-training/:exam" element={<ExamDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          
          {/* Dynamic Catch-all Page Route */}
          <Route path="/p/*" element={<GenericPage />} />
          {/* Fallback for top-level slugs like /happy */}
          <Route path="/:slug" element={<GenericPage />} />
          
          {/* Admin Nested Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="mock-test" element={<AdminMockTest />} />
            <Route path="news-flash" element={<AdminNewsFlash />} />
            <Route path="support-tickets" element={<AdminSupportTickets />} />
            <Route path="invoice" element={<AdminInvoice />} />
            <Route path="doubts" element={<AdminDoubts />} />

            <Route path="guides" element={<AdminGuides />} />
          </Route>

          {/* User Dashboard Nested Routes */}
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="courses" element={<div className="p-8 text-slate-400 italic">My Courses component coming soon...</div>} />
            <Route path="orders" element={<div className="p-8 text-slate-400 italic">My Orders component coming soon...</div>} />
            <Route path="payments" element={<div className="p-8 text-slate-400 italic">Payments component coming soon...</div>} />
            <Route path="support" element={<UserSupport />} />
            <Route path="doubts" element={<UserDoubts />} />
            <Route path="mock-tests" element={<div className="p-8 text-slate-400 italic text-sm font-medium tracking-wide">Mock Test dashboard coming soon...</div>} />
          </Route>

          <Route path="/about" element={<Navigate to="/about/company-profile" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollProgressBar />
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
