import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${baseURL}${endpoint}`, { email, password });
      
      setToken(response.data.token);
      setIsLoading(false);
      navigate('/characters');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', marginBottom: '20px' }}>
        <h1>{isLogin ? 'Welcome' : 'Join MARVEL'}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          maxLength={128}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <div className="auth-toggle">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => { setIsLogin(!isLogin); setError(null); }}>
          {isLogin ? 'Sign up here' : 'Login here'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
