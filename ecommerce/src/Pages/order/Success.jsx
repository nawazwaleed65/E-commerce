import { useEffect, useContext, useState } from "react";
import myContext from "../../Context/context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/layout/layout";


function Success() {
  const { mode } = useContext(myContext);
  const navigate = useNavigate();

  // -------------------------------------------------
  // 1. Pull data that was saved before redirecting
  // -------------------------------------------------
  const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const sessionId = localStorage.getItem("paymentSessionId");

  const [orderSaved, setOrderSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // -------------------------------------------------
  // 2. Calculate totals (same logic as Cart page)
  // -------------------------------------------------
  const subtotal = savedCart.reduce(
    (sum, item) => sum + parseInt(item.price || 0),
    0
  );
  const shipping = 100; // same as in Cart.jsx
  const grandTotal = subtotal + shipping;

  useEffect(() => {
    const saveOrder = async () => {
      if (!sessionId || savedCart.length === 0 || orderSaved || isSaving)
        return;

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) {
        toast.warn("User not found – order saved as guest");
      }

      setIsSaving(true);
      try {
        const res = await fetch("http://localhost:7000/api/save-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user || { email: "guest@example.com" },
            products: savedCart,
            paymentSessionId: sessionId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to save order");
        }

        // ---- success ----
        toast.success("Order saved successfully!");
        setOrderSaved(true);

        // clean up
        localStorage.removeItem("cartItems");
        localStorage.removeItem("paymentSessionId");
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Could not save order");
      } finally {
        setIsSaving(false);
      }
    };

    saveOrder();
  }, [savedCart, sessionId, orderSaved, isSaving]);
  return (
    <Layout>
      <div
        className="min-h-screen pt-10 pb-20 px-4"
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "#f9fafb",
          color: mode === "dark" ? "#fff" : "#111",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {/* Order Summary Card */}
          <div
            className="rounded-lg shadow-lg p-6 mb-8"
            style={{
              backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "#fff",
            }}
          >
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {savedCart.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b pb-3"
                  style={{
                    borderColor: mode === "dark" ? "#444" : "#e5e7eb",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm opacity-75">{item.description}</p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/")} // <-- create this page or link to dashboard
              className="px-6 py-3 border border-violet-600 text-violet-600 rounded-lg font-medium hover:bg-violet-50 transition"
            >
              View My Orders
            </button>
          </div>

          {isSaving && (
            <p className="text-center mt-6 text-sm opacity-70">Saving order…</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Success;
