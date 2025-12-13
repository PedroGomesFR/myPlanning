import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from 'react';

//pages
import MainPage from './components/pages/MainPage.jsx'
import NotFoundPage from './components/pages/NotFoundPage.jsx'
import Header from './components/assets/Header.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import RegisterPage from './components/pages/RegisterPage.jsx'
import ProfilePage from './components/pages/ProfilePage.jsx';
import PlanningPage from './components/pages/PlanningPage.jsx';

function App() {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  return (
    <>
      <Router>
        <Header user={user} />

        <div className="container">
          <Routes>
            
            <Route path="/" element={<MainPage />} />

            <Route path="/home" element={<Navigate to="/" />} />

            <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
            
            <Route path="/register" element={<RegisterPage user={user} setUser={setUser} />} />

            <Route path="/profile" element={<ProfilePage user={user} />} />

            <Route path="/planning" element={<PlanningPage />} />

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </div>
    </Router>
    </>
  )
}

export default App
