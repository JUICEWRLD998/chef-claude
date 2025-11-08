// Main App component with routing between Generate, Cook, and Discover pages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Main from "./components/Main";
import Cook from "./components/Cook";
import Discover from "./components/Discover";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    // Router wraps the entire app to enable navigation between pages
    <Router>
      {/* Routes define which component to show based on URL path */}
      <Routes>
        {/* Public routes - Login and Sign Up */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <Header />
            <Main />
          </ProtectedRoute>
        } />
        
        <Route path="/cook" element={
          <ProtectedRoute>
            <Header />
            <Cook />
          </ProtectedRoute>
        } />
        
        <Route path="/discover" element={
          <ProtectedRoute>
            <Header />
            <Discover />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}