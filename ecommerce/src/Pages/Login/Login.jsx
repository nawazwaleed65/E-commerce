import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import Loader from "../../components/Loader/Loader";
import myContext from "../../Context/context";
import { toast } from "react-toastify";

function Login() {
  const { loading, setLoading } = useContext(myContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // ✅ Toast for success
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Login failed!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setLoading(false); // ✅ Always stop loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <Loader />}
      <div className="bg-gray-800 px-10 py-10 rounded-xl">
        <h1 className="text-center text-white text-xl mb-4 font-bold">Login</h1>

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Email"
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
            placeholder="Password"
          />
        </div>

        <div className="flex justify-center mb-3">
          <button
            onClick={login}
            className="bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg"
          >
            Login
          </button>
        </div>

        <h2 className="text-white text-center">
          Don’t have an account?{" "}
          <Link className="text-yellow-500 font-bold" to="/signup">
            Signup
          </Link>
        </h2>
      </div>
    </div>
  );
}

export default Login;
