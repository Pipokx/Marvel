import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CharacterDetailPage = ({ token }) => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [characterData, setCharacterData] = useState(null);
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${baseURL}/comics/${characterId}`);
        setCharacterData({
          name: response.data.name,
          description: response.data.description,
          thumbnail: response.data.thumbnail
        });
        setComics(response.data.comics || []);

        if (token) {
          const favResponse = await axios.get(`${baseURL}/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFavorites(favResponse.data);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch character details.');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [characterId, token, baseURL]);

  const toggleFavorite = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      navigate('/auth');
      return;
    }
    try {
      await axios.post(`${baseURL}/api/favorites/toggle`, {
        type: 'comic',
        id: item._id || item.id,
        name: item.title,
        thumbnail: item.thumbnail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const idStr = String(item._id || item.id);
      if (favorites.some(f => String(f.entityId) === idStr)) {
        setFavorites(favorites.filter(f => String(f.entityId) !== idStr));
      } else {
        setFavorites([...favorites, { entityId: idStr, type: 'comic' }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <div className="container"><p>Chargement...</p></div>;
  if (error) return <div className="container"><p>{error}</p></div>;
  if (!characterData) return null;

  const characterImageUrl = characterData.thumbnail ? `${characterData.thumbnail.path}.${characterData.thumbnail.extension}` : '';

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="hero">
        <img src={characterImageUrl} alt={characterData.name} />
        <section>
          <h1>{characterData.name}</h1>
          <p>{characterData.description || 'No description available for this character.'}</p>
        </section>
      </section>

      <h2>Related Comics</h2>
      
      {comics.length === 0 ? (
        <p>No comics found for this character.</p>
      ) : (
        <section className="category">
          {comics.map(comic => {
            const isFavorited = favorites.some(f => String(f.entityId) === String(comic._id || comic.id) && f.type === 'comic');
            const imageUrl = comic.thumbnail ? `${comic.thumbnail.path}.${comic.thumbnail.extension}` : '';
            return (
              <article key={comic._id || comic.id}>
                <img src={imageUrl} alt={comic.title} />
                <section>
                  <h3>{comic.title}</h3>
                  {comic.description && (
                    <p>{comic.description.length > 100 ? `${comic.description.substring(0, 100)}...` : comic.description}</p>
                  )}
                </section>
                <button onClick={(e) => toggleFavorite(e, comic)} style={{ color: isFavorited ? '#ec1d24' : '#888' }}>
                  {isFavorited ? '♥' : '♡'}
                </button>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default CharacterDetailPage;
