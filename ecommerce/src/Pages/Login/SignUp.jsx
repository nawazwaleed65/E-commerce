import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../Firebase/Firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "../../components/Loader/Loader";
import myContext from "../../Context/context";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = formData;

  const { loading, setLoading } = useContext(myContext);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Signup Function
  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        name,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        time: Timestamp.now(),
      };

      await addDoc(collection(fireDB, "users"), newUser);

      localStorage.setItem("user", JSON.stringify(userCredential.user));

      toast.success("Signup successful!");
      setFormData({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error.message);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <Loader />}

      <div className="bg-gray-800 px-10 py-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-center text-white text-2xl mb-6 font-bold">Signup</h1>

        {/* Name Input */}
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Full Name"
          className="bg-gray-600 mb-4 px-3 py-2 w-full rounded-lg text-white placeholder-gray-300 outline-none"
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email Address"
          className="bg-gray-600 mb-4 px-3 py-2 w-full rounded-lg text-white placeholder-gray-300 outline-none"
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          className="bg-gray-600 mb-6 px-3 py-2 w-full rounded-lg text-white placeholder-gray-300 outline-none"
        />

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="bg-red-500 hover:bg-red-600 w-full text-white font-bold py-2 rounded-lg transition-colors duration-300"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-300 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
