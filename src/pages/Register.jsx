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
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" placeholder="Full Name" required className="input" />
          <input name="address" placeholder="Address" required className="input" />
          <input type="date" name="dob" required className="input" />
          <input name="phone" placeholder="Phone Number" required className="input" />
          <input type="email" name="email" placeholder="Email" required className="input" />
          <input type="password" name="password" placeholder="Password" required className="input" />

          <button
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
