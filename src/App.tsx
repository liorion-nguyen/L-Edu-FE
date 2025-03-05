import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/home/LandingPage";
import Course from "./pages/home/courses";
import CourseDetail from "./pages/home/courses/[id]";
import Document from "./pages/home/courses/Document";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />

        {/* Home Pages */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/course" element={<MainLayout><Course /></MainLayout>} />
        <Route path="/course/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
        <Route path="/document/:id" element={<MainLayout><Document /></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
