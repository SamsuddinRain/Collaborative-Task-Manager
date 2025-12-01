import React from "react";          // ✅ REQUIRED
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-sm border rounded-lg p-6 bg-white dark:bg-gray-800">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            Login
          </button>
        </form>
        <p className="text-xs mt-3">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
