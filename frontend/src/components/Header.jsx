import { NavLink, Link } from "react-router-dom";

const Header = ({ token, setToken }) => {
  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">
          MARVEL
        </Link>
        
        <nav>
          <NavLink to="/characters" className={({isActive}) => isActive ? 'active' : ''}>
            CHARACTERS
          </NavLink>
          <NavLink to="/comics" className={({isActive}) => isActive ? 'active' : ''}>
            COMICS
          </NavLink>
          <NavLink to="/favorites" className={({isActive}) => isActive ? 'active' : ''}>
            FAVORITES
          </NavLink>
          
          {token ? (
            <button onClick={() => setToken(null)}>LOGOUT</button>
          ) : (
            <Link to="/auth">LOGIN</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
