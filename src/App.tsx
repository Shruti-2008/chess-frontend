import Referee from "./components/Referee";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import Menu from "./components/Menu";
import GameHistory from "./components/GameHistory";
import GameMoves from "./components/GameMoves";
import UserProfile from "./components/UserProfile";
import { AuthProvider } from "./context/AuthProvider";
import Protected from "./components/Protected";
function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Navbar />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route element={<Protected />}>
                <Route path="menu" element={<Menu />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="history" element={<GameHistory />} />
                <Route path="history/:id" element={<GameMoves />} />
              </Route>
              <Route path="game/:id" element={<Referee />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
