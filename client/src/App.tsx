import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LeftSideBar from "./components/Sidebar/LeftSideBar";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex">
      {!isLoginPage && <LeftSideBar />}
      <div className={`flex-grow ${!isLoginPage ? "ml-80" : ""}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </div>
  );
}

export default App;
