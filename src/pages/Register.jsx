import { useFirebase } from "../context/firebaseContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const { signUp } = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      fullName: e.target.fullName.value,
      address: e.target.address.value,
      dob: e.target.dob.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      await signUp(formData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 sm:py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_#121214_inset] [&:-webkit-autofill]:[text-fill-color:white]";
  const labelStyle = "block text-xs font-medium text-gray-400 mb-1 ml-1";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0c] py-4 scheme-dark">
      <div className="max-w-xl w-full bg-white/3 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="text-center mb-6 sm:mb-8 mt-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Join HelpingHands</h2>
          <p className="text-gray-500 text-xs mt-1">
            Fill in your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Full Name</label>
              <input
                name="fullName"
                placeholder="John Doe"
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Phone</label>
              <input
                name="phone"
                placeholder="+1 555..."
                required
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Address</label>
            <input
              name="address"
              placeholder="123 Street, City"
              required
              className={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Date of Birth</label>
              <input
                type="date"
                name="dob"
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@email.com"
                required
                className={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Password</label>
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
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 sm:mt-6 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;