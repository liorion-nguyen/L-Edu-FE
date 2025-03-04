import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/landing/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />

        {/* Landing Pages */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
