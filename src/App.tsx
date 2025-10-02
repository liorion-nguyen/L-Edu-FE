import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/theme.css";
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

function App() {
  return (
    <ThemeProvider>
      <Router>
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
        <Route path="/course/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
        <Route path="/course/update/:id" element={<MainLayout><UpdateCourse /></MainLayout>} />
        <Route path="/course/document/:id" element={<MainLayout><Document /></MainLayout>} />
        <Route path="/course/video/:id" element={<MainLayout><Video /></MainLayout>} />
        <Route path="/session/addSession/:id" element={<MainLayout><AddSession /></MainLayout>} />
        <Route path="/session/updateSession/:id" element={<MainLayout><UpdateSession /></MainLayout>} />


        {/* 404 Not Found */}
        <Route path="*" element={<MainLayout><NotFound/></MainLayout>} />

      </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
