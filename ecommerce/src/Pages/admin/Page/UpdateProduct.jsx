import React, { useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import myContext from "../../../Context/context";
import Layout from "../../../components/layout/layout";
import { fireDB } from "../../../Firebase/Firebase";

function UpdateProduct() {
  const { mode, editProduct } = useContext(myContext);

  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: "",
    imageUrl: "",
    category: "",
    description: "",
  });

  // Load product from context or localStorage
  useEffect(() => {
    const storedProduct = localStorage.getItem("editProduct");
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    } else if (editProduct) {
      setProduct(editProduct);
    }
  }, [editProduct]);

  handleChange = (e) => {
    console.log("ok");
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };
  var handleChange = () => {};
  const updateProduct = async () => {
    if (
      !product.title ||
      !product.price ||
      !product.imageUrl ||
      !product.category ||
      !product.description
    ) {
      return toast.error("All fields are required!");
    }

    if (!product.id) {
      return toast.error("Product ID missing — cannot update!");
    }

    try {
      const productRef = doc(fireDB, "products", product.id);
      const updatedProduct = {
        ...product,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(productRef, updatedProduct);

      toast.success("✅ Product updated successfully!");
      localStorage.removeItem("editProduct"); // cleanup
      setTimeout(() => (window.location.href = "/dashboard"), 800);
    } catch (error) {
      console.error("🔥 Firestore update error:", error);
      toast.error("Error updating product!");
    }
  };

  return (
    <Layout>
      <div
        className="flex justify-center items-center min-h-screen"
        style={{
          backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "#f9fafb",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <div
          className="p-8 rounded-lg shadow-lg w-full max-w-lg"
          style={{
            backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "white",
            color: mode === "dark" ? "white" : "black",
          }}
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Update Product
          </h2>

          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows="4"
            />
          </div>

          <button
            onClick={updateProduct}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded"
          >
            Update Product
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateProduct;
