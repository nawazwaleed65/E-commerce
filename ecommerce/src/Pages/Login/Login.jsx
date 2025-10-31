import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../Firebase/Firebase";
import Loader from "../../components/Loader/Loader";
import myContext from "../../Context/context";
import { toast } from "react-toastify";
import Layout from "../../components/layout/layout";
import { FaGoogle, FaApple } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {
  const { loading, setLoading } = useContext(myContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("buyer"); // UI toggle

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      // ✅ Step 1: Firebase Auth login
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // ✅ Step 2: Get Firestore user data
      const usersRef = collection(fireDB, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No user record found in Firestore!");
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", userData.role);

      if (userData.role === "admin") {
        toast.success("Welcome, Admin!");
        navigate("/admin"); // admin page
      } else if (userData.role === "buyer") {
        toast.success("Welcome back!");
        navigate("/"); // home page
      } else {
        toast.error("Invalid user role!");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center h-screen">
        {loading && <Loader />}

        <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full">
          <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-gray-100">
            {/* ✅ User Type Toggle (UI only) */}
            {/* <div className="flex justify-center mb-6">
              <button
                onClick={() => setUserType("buyer")}
                className={`px-4 py-2 rounded-l-md font-semibold ${
                  userType === "buyer"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Buyer
              </button>
              <button
                onClick={() => setUserType("admin")}
                className={`px-4 py-2 rounded-r-md font-semibold ${
                  userType === "admin"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Admin
              </button>
            </div> */}

            {/* ✅ Social login placeholder */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => toast.info("Google login not implemented yet")}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-3 font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <FaGoogle className="text-xl" /> Continue with Google
              </button>

              <button
                onClick={() => toast.info("Apple login not implemented yet")}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-3 font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <FaApple className="text-xl" /> Continue with Apple
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-700 font-medium">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded font-semibold text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-900 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
