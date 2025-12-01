import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-sm border rounded-lg p-6 bg-white dark:bg-gray-800">
        <h1 className="text-xl font-semibold mb-4">Signup</h1>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
            required
          />
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
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            Signup
          </button>
        </form>
        <p className="text-xs mt-3">
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
