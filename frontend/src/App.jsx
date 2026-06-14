import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./App.css";
import Header from "./components/Header";
import CharactersPage from "./pages/CharactersPage";
import ComicsPage from "./pages/ComicsPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [token, setToken] = useState(Cookies.get("marvel-token") || null);

  const handleSetToken = (newToken) => {
    if (newToken) {
      Cookies.set("marvel-token", newToken, { expires: 14 });
      setToken(newToken);
    } else {
      Cookies.remove("marvel-token");
      setToken(null);
    }
  };

  return (
    <>
      <Header token={token} setToken={handleSetToken} />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/characters" replace />} />
          <Route path="/characters" element={<CharactersPage token={token} />} />
          <Route path="/comics" element={<ComicsPage token={token} />} />
          <Route path="/comics/:characterId" element={<CharacterDetailPage token={token} />} />
          <Route path="/favorites" element={<FavoritesPage token={token} />} />
          <Route path="/auth" element={<AuthPage token={token} setToken={handleSetToken} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
