import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/layout";
import myContext from "../../Context/context";
import { toast } from "react-toastify";
import { getUser } from "./auth";

const Order = () => {
  const { mode, order, loading } = useContext(myContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser?.email) {
      toast.info("Please log in to view your orders.");
      navigate("/login");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const paidUserOrders = order.filter((ord) => {
    return (
      ord.user?.email === user?.email &&     // belongs to user
      ord.paymentStatus === "paid" &&        // ← ONLY PAID
      ord.paymentSessionId                   // ← has Stripe session
    );
  });

  // Sort newest first
  const sortedOrders = [...paidUserOrders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Loading orders...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen pt-10 pb-20 px-4"
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "#f9fafb",
          color: mode === "dark" ? "#fff" : "#111",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">My Orders</h1>

          {sortedOrders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl mb-4">No paid orders found.</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedOrders.map((ord) => {
                const subtotal = ord.products.reduce(
                  (sum, item) => sum + parseInt(item.price || 0),
                  0
                );
                const shipping = 100;
                const total = subtotal + shipping;

                return (
                  <OrderCard
                    key={ord.id}
                    order={ord}
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                    mode={mode}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const OrderCard = ({ order, subtotal, shipping, total, mode }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg shadow-md p-6 transition-all"
      style={{
        backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "#fff",
        border: mode === "dark" ? "1px solid #444" : "1px solid #e5e7eb",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <p className="text-sm opacity-70">
            Order ID: <span className="font-mono">{order.id}</span>
          </p>
          <p className="text-sm">
            Placed on:{" "}
            {new Date(order.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            at{" "}
            {new Date(order.date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">${total}</p>
          <p className="text-sm text-green-600 font-medium">
            Paid
          </p>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-violet-600 hover:underline text-sm font-medium mb-3"
      >
        {expanded ? "Hide Details" : "View Details"}
      </button>

      {expanded && (
        <div className="border-t pt-4 space-y-4">
          {order.products.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-2 border-b last:border-0"
              style={{
                borderColor: mode === "dark" ? "#555" : "#e5e7eb",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm opacity-75">{item.description}</p>
              </div>
              <p className="font-semibold">${item.price}</p>
            </div>
          ))}

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;