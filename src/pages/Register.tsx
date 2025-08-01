import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import mainLogo from '../assets/main-logo.svg';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-sm backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <img src={mainLogo} alt="Main Logo" className="h-12 mb-4  invert" />
          <h2 className="text-2xl font-semibold text-white">Create your account</h2>
          <p className="text-sm text-gray-400 mt-1">
            or{' '}
            <Link
              to="/login"
              className="underline text-white hover:text-gray-300"
            >
              sign in to an existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
          />

          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-white text-black rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
