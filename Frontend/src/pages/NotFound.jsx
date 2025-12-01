import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-semibold mb-2">404 - Page Not Found</h1>
      <Link to="/" className="underline text-sm">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
