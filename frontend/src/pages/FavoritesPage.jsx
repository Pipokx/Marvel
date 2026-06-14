import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const FavoritesPage = ({ token }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const loadFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load favorites.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth');
    } else {
      loadFavorites();
    }
  }, [token, navigate]);

  const toggleFavorite = async (e, type, id, name, thumbnail) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.post(`${baseURL}/api/favorites/toggle`, {
        type, id, name, thumbnail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter(f => String(f.entityId) !== String(id)));
    } catch (err) {
      console.log(err);
    }
  };

  if (!token) return null;

  const characterFavorites = favorites.filter(fav => fav.type === 'character');
  const comicFavorites = favorites.filter(fav => fav.type === 'comic');

  return (
    <div className="container">
      <h1>Your Favorites</h1>

      {error ? (
        <div>
          <p>{error}</p>
          <button onClick={loadFavorites} style={{ marginTop: '10px' }}>Retry</button>
        </div>
      ) : isLoading ? (
        <p>Chargement...</p>
      ) : favorites.length === 0 ? (
        <p>You have no favorites yet.</p>
      ) : (
        <>
          {characterFavorites.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2>Favorite Characters</h2>
              <section className="category">
                {characterFavorites.map(fav => {
                  const imageUrl = fav.thumbnail ? `${fav.thumbnail.path}.${fav.thumbnail.extension}` : '';
                  return (
                    <article key={fav.entityId}>
                      <Link to={`/comics/${fav.entityId}`}>
                        <img src={imageUrl} alt={fav.name} />
                        <section>
                          <h3>{fav.name}</h3>
                        </section>
                      </Link>
                      <button onClick={(e) => toggleFavorite(e, 'character', fav.entityId, fav.name, fav.thumbnail)} style={{ color: '#ec1d24' }}>
                        ♥
                      </button>
                    </article>
                  );
                })}
              </section>
            </div>
          )}

          {comicFavorites.length > 0 && (
            <div>
              <h2>Favorite Comics</h2>
              <section className="category">
                {comicFavorites.map(fav => {
                  const imageUrl = fav.thumbnail ? `${fav.thumbnail.path}.${fav.thumbnail.extension}` : '';
                  return (
                    <article key={fav.entityId}>
                      <img src={imageUrl} alt={fav.name} />
                      <section>
                        <h3>{fav.name}</h3>
                      </section>
                      <button onClick={(e) => toggleFavorite(e, 'comic', fav.entityId, fav.name, fav.thumbnail)} style={{ color: '#ec1d24' }}>
                        ♥
                      </button>
                    </article>
                  );
                })}
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
