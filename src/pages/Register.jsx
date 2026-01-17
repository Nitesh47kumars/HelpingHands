import { useFirebase } from "../context/firebaseContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { signUp } = useFirebase();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <input name="email" placeholder="Email" className="input" />
      <input name="password" type="password" placeholder="Password" className="input" />
      <button className="btn">Register</button>
    </form>
  );
};

export default Register;
