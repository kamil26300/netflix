import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchedPage from "./pages/SearchedPage";
import { Toaster } from "react-hot-toast";
import TVShows from "./pages/TVShows";
import SignUp from "./pages/SignUp";
import Movies from "./pages/Movies";
import Player from "./pages/Player";
import Login from "./pages/Login";
import Home from "./pages/Home";
import axios from "axios";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const currentUrl = window.location.pathname;

      if (currentUrl === "/") navigate("/home");

      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_END + "/auth/verify",
          {
            withCredentials: true,
          }
        );

        if (!response.data.valid) {
          if (!currentUrl.includes("/signup") && !currentUrl.includes("/login"))
            navigate("/login");
        } else {
          setUserId(response.data.userId);
          if (currentUrl.includes("/signup") || currentUrl.includes("/login"))
            navigate("/home");
        }
      } catch (error) {
        console.log(error);
        if (!currentUrl.includes("/signup") && !currentUrl.includes("/login"))
          navigate("/login");
      }
    };

    checkTokenValidity();
  }, [navigate]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/home" element={<Home userId={userId} />} />
        <Route exact path="/tv-shows" element={<TVShows />} />
        <Route exact path="/movies" element={<Movies />} />
        <Route exact path="/search" element={<SearchedPage />} />
        <Route exact path="/player/:id" element={<Player />} />
      </Routes>
    </>
  );
}

export default App;
