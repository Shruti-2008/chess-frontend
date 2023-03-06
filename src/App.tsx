import Referee from "./components/Referee";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./components/Home";
import Menu from "./components/Menu";
import GameHistory from "./components/GameHistory";
import UserProfile from "./components/UserProfile";
import { AuthProvider } from "./context/AuthProvider";
import Protected from "./components/Protected";
import GameDetail from "./components/GameDetail";
import PageNotFound from "./components/PageNotFound";
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
                <Route path="history/:id" element={<GameDetail />} />
                <Route path="game/:id" element={<Referee />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
