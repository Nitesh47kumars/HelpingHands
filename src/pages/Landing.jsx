import { Link } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";

const Landing = () => {
  const { user } = useFirebase();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0c] text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[140px]" />
      </div>

      <div className="max-w-4xl text-center px-6 z-10">
        <span className="inline-flex items-center px-4 py-1.5 mb-8 text-sm font-medium tracking-wide text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full animate-pulse">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          Community Driven Support
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          Lend a hand,
          <span className="bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            change a life.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          HelpingHands is the bridge between those who need support and those who want to give it. 
          Join a community built on kindness and local action.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                Get Started for Free
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 bg-transparent text-gray-300 font-semibold border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300 w-full sm:w-auto"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 md:gap-20">
          <div className="text-center group">
            <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">2k+</p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Helped Today</p>
          </div>
          <div className="text-center group">
            <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">150+</p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Communities</p>
          </div>
          <div className="text-center group">
            <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">100%</p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Free to Use</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;