import { useState, useEffect } from "react";
import myContext from "./context";
import { fireDB } from "../Firebase/Firebase";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

function MyState(props) {
  const [mode, setMode] = useState("light");
  const [loading, setLoading] = useState(false);

  // 🌗 Dark / Light Mode Toggle
  const toggleMode = () => {
    if (mode === "dark") {
      setMode("light");
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    } else {
      setMode("dark");
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🧾 Single Product (Form)
  const [product, setProduct] = useState({
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const [productList, setProductList] = useState([]);

  const addProduct = async () => {
    if (
      !product.title ||
      !product.price ||
      !product.imageUrl ||
      !product.category ||
      !product.description
    ) {
      return toast.error("All fields are required");
    }

    if (!currentUser) {
      return toast.error("User not logged in");
    }

    setLoading(true);
    try {
      const productRef = collection(fireDB, "products");
      const newProduct = {
        ...product,
        sellerEmail: currentUser.email,
        sellerUID: currentUser.uid,
        role: currentUser.role || "admin",
      };

      await addDoc(productRef, newProduct);
      toast.success("Product added successfully");

      setTimeout(() => (window.location.href = "/productDetail"), 800);
      getProductData();
    } catch (error) {
      console.log(error);
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  // 📦 Get All Products
  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProductList(productsArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const [editProduct, setEditProduct] = useState(null);

  const editHandle = (item) => {
    setEditProduct(item);
    localStorage.setItem("editProduct", JSON.stringify(item));
  };

  const updateProduct = async () => {
    if (!product.id) return toast.error("No product selected");

    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", product.id), {
        ...product,
        sellerEmail: currentUser.email,
        sellerUID: currentUser.uid,
        role: currentUser.role || "admin",
      });

      toast.success("Product updated successfully");
      setTimeout(() => (window.location.href = "/productDetail"), 800);
      getProductData();
    } catch (error) {
      console.log(error);
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete Product
  const deleteProduct = async (item) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("Product deleted successfully");
      getProductData();
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Orders
  const [order, setOrder] = useState([]);

  const getOrderData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "orders"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const ordersArray = [];
      snapshot.forEach((doc) => {
        ordersArray.push({ id: doc.id, ...doc.data() });
      });
      setOrder(ordersArray);
      console.log("Fetched orders:", ordersArray);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderData();
  }, []);

  // 👤 Users
  const [user, setUser] = useState([]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "users"));
      const usersArray = [];
      result.forEach((doc) => {
        usersArray.push(doc.data());
      });
      setUser(usersArray);
      console.log(usersArray);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // 🔍 Filters
  const [searchkey, setSearchkey] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  return (
    <myContext.Provider
      value={{
        mode,
        toggleMode,
        loading,
        setLoading,
        product,
        setProduct,
        productList,
        addProduct,
        editHandle,
        editProduct,
        deleteProduct,
        updateProduct,
        order,
        setOrder,
        user,
        searchkey,
        setSearchkey,
        filterType,
        setFilterType,
        filterPrice,
        setFilterPrice,
      }}
    >
      {props.children}
    </myContext.Provider>
  );
}

export default MyState;
