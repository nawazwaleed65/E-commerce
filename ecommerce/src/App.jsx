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

function App() {
  return (
    <MyState>
      <Routes>
        <Route path="/success" element={<Success />} />
        <Route path="allProducts" element={<AllProduct/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/productInfo/:id" element={<ProductInfo />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/updateProduct" element={<UpdateProduct />} />
      </Routes>
      <ToastContainer />
    </MyState>
  );
}

export default App;
