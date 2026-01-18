import { useFirebase } from "../context/firebaseContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { signIn } = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 sm:py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_#121214_inset] [&:-webkit-autofill]:[text-fill-color:white]";
  const labelStyle = "block text-xs font-medium text-gray-400 mb-1 ml-1";

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#0a0a0c] px-4 scheme-dark">
      <div className="max-w-md w-full bg-white/3 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-xs mt-1.5">
            Enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@email.com"
              required
              className={inputStyle}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 mr-1">
              <label className={labelStyle}>Password</label>
              <Link to="/forgot-password" className="text-[10px] text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className={inputStyle}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-blue-900/20"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;