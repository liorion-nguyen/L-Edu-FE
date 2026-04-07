import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./styles/theme.css";
import "./styles/dashboardProgramShell.css";
import "./i18n"; // Initialize i18n
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import OAuthCallback from "./pages/auth/OAuthCallback";
import GoogleCallback from "./pages/auth/GoogleCallback";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import EmailVerification from "./pages/auth/EmailVerification";
import LandingPage from "./pages/home/LandingPage";
import AboutUs from "./pages/home/about";
import Course from "./pages/home/courses";
import CreateCourse from "./pages/home/courses/CreateCourse";
import UpdateCourse from "./pages/home/courses/UpdateCourse";
import CourseDetail from "./pages/home/courses/[id]";
import Profile from "./pages/home/profile";
import AddSession from "./pages/home/sessions/AddSession";
import Document from "./pages/home/sessions/Document";
import UpdateSession from "./pages/home/sessions/UpdateSession";
import Video from "./pages/home/sessions/Video";
import CodeEditorPage from "./pages/home/CodeEditorPage";
import ChatbotTestPage from "./pages/test/ChatbotTestPage";
import DebugAuthPage from "./pages/test/DebugAuthPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import StudentDashboardLayout from "./layouts/StudentDashboardLayout";
import StudentOverview from "./pages/dashboard/student/StudentOverview";
import StudentCourseCatalog from "./pages/dashboard/student/StudentCourseCatalog";
import StudentCourseSessions from "./pages/dashboard/student/StudentCourseSessions";
import StudentSettingsPage from "./pages/dashboard/student/StudentSettingsPage";
import StudentClassManagement from "./pages/dashboard/student/StudentClassManagement";
import StudentSchedulePage from "./pages/dashboard/student/StudentSchedulePage";
import StudentCertificatesPage from "./pages/dashboard/student/StudentCertificatesPage";
import UserManagement from "./pages/dashboard/UserManagement";
import CourseManagement from "./pages/dashboard/CourseManagement";
import SessionManagement from "./pages/dashboard/SessionManagement";
import ReviewManagement from "./pages/dashboard/ReviewManagement";
import FooterManagement from "./pages/dashboard/FooterManagement";
import ContactManagement from "./pages/dashboard/ContactManagement";
import ChatManagement from "./pages/dashboard/ChatManagement";
import WebSocketDebug from "./components/debug/WebSocketDebug";
import ContentManagement from "./pages/dashboard/ContentManagement";
import CategoryManagement from "./pages/dashboard/CategoryManagement";
import CourseRegistrationManagement from "./components/admin/CourseRegistrationManagement";
import ExamManagementPage from "./pages/dashboard/ExamManagement";
import LinkedAppManagement from "./pages/dashboard/LinkedAppManagement";
import ExamAttemptHistory from "./pages/dashboard/ExamAttemptHistory";
import ExamOverviewPage from "./pages/exams/ExamOverviewPage";
import ExamTakingPage from "./pages/exams/ExamTakingPage";
import ExamResultPage from "./pages/exams/ExamResultPage";
import MyClassesPage from "./pages/home/my-classes/MyClassesPage";
import ClassDetailPage from "./pages/home/my-classes/ClassDetailPage";
import Seo from "./components/seo/Seo";

function App() {
  return (
    <Router>
      <Seo />
      <Routes>
        {/* Test Pages */}
        <Route path="/test/chatbot" element={<MainLayout><ChatbotTestPage /></MainLayout>} />
        <Route path="/test/debug-auth" element={<MainLayout><DebugAuthPage /></MainLayout>} />
        
        {/* Authentication Pages */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        <Route path="/change-password" element={<AuthLayout><ChangePassword /></AuthLayout>} />
        <Route path="/email-verification/verify" element={<EmailVerification />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/auth/google/callback" element={<AuthLayout><GoogleCallback /></AuthLayout>} />

        {/* Home Pages */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/aboutus" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/course" element={<MainLayout><Course /></MainLayout>} />
        <Route path="/course/create" element={<MainLayout><CreateCourse /></MainLayout>} />
        <Route path="/code-editor" element={<MainLayout><CodeEditorPage /></MainLayout>} />
        <Route path="/profile/:id" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/my-classes" element={<MainLayout><MyClassesPage /></MainLayout>} />
        <Route path="/my-classes/:id" element={<MainLayout><ClassDetailPage /></MainLayout>} />
        <Route path="/course/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
        <Route path="/course/update/:id" element={<MainLayout><UpdateCourse /></MainLayout>} />
        <Route path="/course/document/:id" element={<MainLayout><Document /></MainLayout>} />
        <Route path="/course/video/:id" element={<MainLayout><Video /></MainLayout>} />
        <Route path="/session/addSession/:id" element={<MainLayout><AddSession /></MainLayout>} />
        <Route path="/session/updateSession/:id" element={<MainLayout><UpdateSession /></MainLayout>} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
        <Route path="/dashboard/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
        <Route path="/dashboard/courses" element={<DashboardLayout><CourseManagement /></DashboardLayout>} />
        <Route path="/dashboard/sessions" element={<DashboardLayout><SessionManagement /></DashboardLayout>} />
        <Route path="/dashboard/reviews" element={<DashboardLayout><ReviewManagement /></DashboardLayout>} />
        <Route path="/dashboard/footer" element={<DashboardLayout><FooterManagement /></DashboardLayout>} />
        <Route path="/dashboard/contact" element={<DashboardLayout><ContactManagement /></DashboardLayout>} />
        <Route path="/dashboard/chat" element={<DashboardLayout><ChatManagement /></DashboardLayout>} />
        <Route path="/dashboard/exams" element={<DashboardLayout><ExamManagementPage /></DashboardLayout>} />
        <Route path="/dashboard/exams/history" element={<DashboardLayout><ExamAttemptHistory /></DashboardLayout>} />
        <Route path="/exams/:examId" element={<MainLayout><ExamOverviewPage /></MainLayout>} />
        <Route path="/exams/:examId/take" element={<MainLayout><ExamTakingPage /></MainLayout>} />
        <Route path="/exams/:examId/result/:attemptId" element={<MainLayout><ExamResultPage /></MainLayout>} />
        <Route path="/debug/websocket" element={<WebSocketDebug />} />
        <Route path="/dashboard/content" element={<DashboardLayout><ContentManagement /></DashboardLayout>} />
        <Route path="/dashboard/categories" element={<DashboardLayout><CategoryManagement /></DashboardLayout>} />
        <Route path="/dashboard/course-registrations" element={<DashboardLayout><CourseRegistrationManagement /></DashboardLayout>} />
        <Route path="/dashboard/linked-apps" element={<DashboardLayout><LinkedAppManagement /></DashboardLayout>} />

        {/* Student Dashboard (new layout) */}
        <Route path="/dashboard-program" element={<StudentDashboardLayout><StudentOverview /></StudentDashboardLayout>} />
        <Route
          path="/dashboard-program/courses/:courseId"
          element={
            <StudentDashboardLayout>
              <StudentCourseSessions />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/learn/document/:id"
          element={
            <StudentDashboardLayout>
              <Document />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/learn/video/:id"
          element={
            <StudentDashboardLayout>
              <Video />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/exams/:examId"
          element={
            <StudentDashboardLayout>
              <ExamOverviewPage />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/exams/:examId/take"
          element={
            <StudentDashboardLayout>
              <ExamTakingPage />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/exams/:examId/result/:attemptId"
          element={
            <StudentDashboardLayout>
              <ExamResultPage />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/courses"
          element={
            <StudentDashboardLayout>
              <StudentCourseCatalog />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/schedule"
          element={
            <StudentDashboardLayout>
              <StudentSchedulePage />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/classes"
          element={
            <StudentDashboardLayout>
              <StudentClassManagement />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/classes/:id"
          element={
            <StudentDashboardLayout>
              <ClassDetailPage />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/certificates"
          element={
            <StudentDashboardLayout>
              <StudentCertificatesPage />
            </StudentDashboardLayout>
          }
        />
        <Route
          path="/dashboard-program/settings"
          element={
            <StudentDashboardLayout>
              <StudentSettingsPage />
            </StudentDashboardLayout>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<MainLayout><NotFound/></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
