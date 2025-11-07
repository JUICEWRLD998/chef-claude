// Main App component with routing between Generate and Cook pages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Main from "./components/Main";
import Cook from "./components/Cook";

export default function App() {
  return (
    // Router wraps the entire app to enable navigation between pages
    <Router>
      {/* Header appears on all pages */}
      <Header />
      
      {/* Routes define which component to show based on URL path */}
      <Routes>
        {/* Generate page - shown at root path "/" */}
        <Route path="/" element={<Main />} />
        
        {/* Cook page - shown at "/cook" path */}
        <Route path="/cook" element={<Cook />} />
      </Routes>
    </Router>
  );
}