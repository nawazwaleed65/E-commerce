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

  // --------------------------
  // ✅ Dark / Light Mode Toggle
  // --------------------------
  const toggleMode = () => {
    if (mode === "dark") {
      setMode("light");
      document.body.style.backgroundColor = "rgb(255, 255, 255)";
      document.body.style.color = "black";
    } else {
      setMode("dark");
      document.body.style.backgroundColor = "rgb(0, 0, 0)";
      document.body.style.color = "white";
    }
  };

  const [products, setProducts] = useState({
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

  const addProduct = async () => {
    if (
      !products.title ||
      !products.price ||
      !products.imageUrl ||
      !products.category ||
      !products.description
    ) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, products);
      toast.success("Product added successfully");
      setTimeout(() => (window.location.href = "/dashboard"), 800);
      getProductData();
    } catch (error) {
      console.log(error);
      toast.error("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const [product, setProduct] = useState([]);

  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productArray = [];
        QuerySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productArray);
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

  const edithandle = (item) => {
    setProducts(item);
  };

  const updateProduct = async () => {
    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", products.id), products);
      toast.success("Product updated successfully");
      setTimeout(() => (window.location.href = "/dashboard"), 800);
      getProductData();
    } catch (error) {
      console.log(error);
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

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

  const [user, setUser] = useState([]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "users"));
      const usersArray = [];
      result.forEach((doc) => {
        usersArray.push(doc.data());
        setLoading(false);
      });
      setUser(usersArray);
      console.log(usersArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
    getOrderData();
    getUserData();
  }, []);

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
        products,
        product,
        addProduct,
        edithandle,
        setProducts,
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
