import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/pages/Login";
import Signup from "./Component/pages/Signup";
import Home from "./Component/Home";
import "./App.css";
import Profile from "./Component/Profile"; 

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Always open login first */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Profile />} />  {/*  Added */}
      </Routes>
    </Router>
  );
}

export default App;
