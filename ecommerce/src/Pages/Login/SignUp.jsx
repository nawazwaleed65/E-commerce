import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../Firebase/Firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "../../components/Loader/Loader";
import myContext from "../../Context/context";
import Layout from "../../components/layout/layout";
import { FaGoogle, FaApple } from "react-icons/fa";

function Signup() {
  const { loading, setLoading } = useContext(myContext);
  const navigate = useNavigate();

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    role: "buyer", // default role
  });
  const [newsletter, setNewsletter] = useState(false);

  const { name, email, password, gender, role } = formData;

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Google Signup (optional)
  const handleGoogle = () => {
    toast.info("Google signup not implemented yet.");
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !gender) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      // ✅ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = {
        name,
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        gender,
        role,
        newsletter,
        createdAt: Timestamp.now(),
      };

      // ✅ Save user in Firestore
      await addDoc(collection(fireDB, "users"), newUser);

      // ✅ Save locally
      await setDoc(doc(fireDB, "users", userCredential.user.uid), newUser);

      localStorage.setItem("userRole", role);

      toast.success("Signup successful!");
      setFormData({
        name: "",
        gender: "",
        email: "",
        password: "",
        role: "buyer",
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error.message);
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        {loading && <Loader />}

        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-gray-100">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create an Account
          </h2>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-3 font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-xl" /> Continue with Google
            </button>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-3 font-medium text-gray-700 hover:bg-gray-50 transition">
              <FaApple className="text-xl" /> Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Role (Buyer/Admin) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                name="role"
                value={role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {/* Newsletter */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="updates"
                checked={newsletter}
                onChange={() => setNewsletter(!newsletter)}
                className="mt-1"
              />
              <label htmlFor="updates" className="text-sm text-gray-600">
                Keep me updated by email with the latest news and rewards.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mb-3 py-3 rounded font-medium text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Signup;
