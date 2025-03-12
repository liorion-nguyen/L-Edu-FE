import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/home/LandingPage";
import Course from "./pages/home/courses";
import CourseDetail from "./pages/home/courses/[id]";
import Document from "./pages/home/sessions/Document";
import AddSession from "./pages/home/sessions/AddSession";
import UpdateSession from "./pages/home/sessions/UpdateSession";
import UpdateCourse from "./pages/home/courses/UpdateCourse";
import AboutUs from "./pages/home/about";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />

        {/* Home Pages */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/aboutUs" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/course" element={<MainLayout><Course /></MainLayout>} />
        <Route path="/course/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
        <Route path="/course/update/:id" element={<MainLayout><UpdateCourse /></MainLayout>} />
        <Route path="course/document/:id" element={<MainLayout><Document /></MainLayout>} />
        <Route path="/session/addSession/:id" element={<MainLayout><AddSession /></MainLayout>} />
        <Route path="/session/updateSession/:id" element={<MainLayout><UpdateSession /></MainLayout>} />

        {/* 404 Not Found */}
        <Route path="*" element={<MainLayout><NotFound/></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
