import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-7xl font-bold text-orange-500">404</h1>

      <p className="text-xl text-gray-600 mt-3">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;