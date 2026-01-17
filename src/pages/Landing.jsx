import { Link } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";

const Landing = () => {
  const { user } = useFirebase();

  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-3xl text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          HelpingHands
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          A simple platform where people can request help and others can offer it.
          Connect, support, and make a difference in your community.
        </p>

        <div className="flex justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Landing;
