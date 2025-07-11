import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import LandingPage from "./pages/home/LandingPage";
import AboutUs from "./pages/home/about";
import Course from "./pages/home/courses";
import UpdateCourse from "./pages/home/courses/UpdateCourse";
import CourseDetail from "./pages/home/courses/[id]";
import Profile from "./pages/home/profile";
import AddSession from "./pages/home/sessions/AddSession";
import Document from "./pages/home/sessions/Document";
import UpdateSession from "./pages/home/sessions/UpdateSession";
import Video from "./pages/home/sessions/Video";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />

        {/* Home Pages */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/aboutus" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/profile/:id" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/course" element={<MainLayout><Course /></MainLayout>} />
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
  );
}

export default App;
