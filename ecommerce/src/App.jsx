import { Routes, Route, Navigate } from "react-router-dom";
import MyState from "./Context/state";
import Home from "./Pages/home/home";
import ProductInfo from "./Pages/productInfo/productInfo";
import Cart from "./Pages/cart/cart";
import Dashboard from "./Pages/admin/dashboard/dashboard";
import AddProduct from "./Pages/admin/Page/AddProduct";
import UpdateProduct from "./Pages/admin/Page/UpdateProduct";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Login/SignUp";
import Order from "./Pages/order/order";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./Pages/order/Success";
import AllProduct from "./Pages/allProduct/allProduct";
import CheckoutSuccess from "./Pages/order/CheckoutSuccess";

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <MyState>
      <Routes>
        {/* 🛒 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/success" element={<Success />} />
        <Route path="/allProducts" element={<AllProduct />} />
        <Route path="/productInfo/:id" element={<ProductInfo />} />

        {/* 🏠 Buyer Routes (buyer only) */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["buyer", "admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* ⚙️ Admin Routes (admin only) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateProduct"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer />
    </MyState>
  );
}

export default App;
