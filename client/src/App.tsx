import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LeftSideBar from "./components/Sidebar/LeftSideBar";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import TweetThread from "./components/Layout/TweetThread";
// import { useSelector } from "react-redux";
// import { RootState } from "./store";

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  //const user = useSelector((state: RootState) => state.user);
  return (
    <div className="flex">
      {!isLoginPage && <LeftSideBar />}
      <div className={`flex-grow ${!isLoginPage ? "ml-20 lg:ml-80" : ""}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userID" element={<ProfilePage />} />
          <Route path="/:userID/status/:id" element={<TweetThread />} />
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
