import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow mb-4">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Collaborative Task Manager
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded border text-sm"
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user ? (
            <>
              <span className="text-sm">
                {user.name} ({user.role})
              </span>
              <Link
                to="/dashboard"
                className="text-sm underline"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-red-500 text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm underline">
                Login
              </Link>
              <Link to="/signup" className="text-sm underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
