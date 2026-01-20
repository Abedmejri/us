import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DrawingPage from './pages/DrawingPage';
import GamePage from './pages/GamePage';
import Invite from './pages/Invite';
import AdminPage from './pages/AdminPage';
import Timeline from './pages/Timeline';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import FloatingElements from './components/FloatingElements';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div>
      <FloatingElements />
      <Navbar user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/draw"
            element={user ? <DrawingPage user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/game"
            element={user ? <GamePage user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/invite"
            element={user ? <Invite user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user?.isAdmin ? <AdminPage /> : <Navigate to="/" />}
          />
          <Route
            path="/timeline"
            element={user ? <Timeline user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <MusicPlayer />
    </div>
  );
}

export default App;
