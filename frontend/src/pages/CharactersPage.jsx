import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";

const CharactersPage = ({ token }) => {
  const [data, setData] = useState({ results: [], count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${baseURL}/characters?page=${currentPage}&name=${searchQuery}`);
        setData(response.data);

        if (token) {
          const favResponse = await axios.get(`${baseURL}/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFavorites(favResponse.data);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery, token, baseURL]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    setCurrentPage(1);
  };

  const toggleFavorite = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      navigate('/auth');
      return;
    }
    try {
      await axios.post(`${baseURL}/api/favorites/toggle`, {
        type: 'character',
        id: item._id || item.id,
        name: item.name,
        thumbnail: item.thumbnail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const idStr = String(item._id || item.id);
      if (favorites.some(f => String(f.entityId) === idStr)) {
        setFavorites(favorites.filter(f => String(f.entityId) !== idStr));
      } else {
        setFavorites([...favorites, { entityId: idStr, type: 'character' }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const totalPages = Math.ceil((data.count || 0) / 100);

  return (
    <div className="container">
      <h1>Characters</h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search for a character..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Search</button>
      </form>

      {error ? (
        <p>{error}</p>
      ) : isLoading ? (
        <p>Chargement...</p>
      ) : data.results.length === 0 ? (
        <p>No characters found.</p>
      ) : (
        <>
          <section className="category">
            {data.results.map(item => {
              const isFavorited = favorites.some(f => String(f.entityId) === String(item._id || item.id) && f.type === 'character');
              const imageUrl = item.thumbnail ? `${item.thumbnail.path}.${item.thumbnail.extension}` : '';
              
              return (
                <article key={item._id || item.id}>
                  <Link to={`/comics/${item._id || item.id}`}>
                    <img src={imageUrl} alt={item.name} />
                    <section>
                      <h3>{item.name}</h3>
                      {item.description && (
                        <p>{item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}</p>
                      )}
                    </section>
                  </Link>
                  <button onClick={(e) => toggleFavorite(e, item)} style={{ color: isFavorited ? '#ec1d24' : '#888' }}>
                    {isFavorited ? '♥' : '♡'}
                  </button>
                </article>
              );
            })}
          </section>
          
          <div className="pagination">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              disabled={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CharactersPage;
