import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Page not found.
      </p>
      <Link to="/characters" className="not-found-link">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
