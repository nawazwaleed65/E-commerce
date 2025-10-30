import { useEffect, useState } from "react";
import { fireDB } from "../../Firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Loader from "../../components/Loader/Loader";
import Layout from "../../components/layout/layout";

const Order = ({ mode }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.email) {
          console.error(
            "❌ No user logged in or missing email in localStorage"
          );
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch all orders for the logged-in user
        const ordersQuery = query(
          collection(fireDB, "orders"),
          where("userEmail", "==", user.email)
        );

        const snapshot = await getDocs(ordersQuery);

        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersList);
      } catch (error) {
        console.error("🔥 Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <Layout>
      <div>
        <h1
          className="text-center mb-5 text-3xl font-semibold underline"
          style={{ color: mode === "dark" ? "white" : "" }}
        >
          Order Details
        </h1>
        {orders.length > 0 ? (
          <div className="h-full pt-10">
            {orders.map((order) => (
              <div
                key={order.id}
                className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 mb-6"
              >
                {order.products.map((item, index) => (
                  <div key={index} className="rounded-lg md:w-2/3">
                    <div
                      className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                      style={{
                        backgroundColor: mode === "dark" ? "#282c34" : "",
                        color: mode === "dark" ? "white" : "",
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt="product-image"
                        className="w-full rounded-lg sm:w-40"
                      />
                      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                        <div className="mt-5 sm:mt-0">
                          <h2
                            className="text-lg font-bold text-gray-900"
                            style={{ color: mode === "dark" ? "white" : "" }}
                          >
                            {item.title}
                          </h2>
                          {item.description && (
                            <p
                              className="mt-1 text-xs text-gray-700"
                              style={{ color: mode === "dark" ? "white" : "" }}
                            >
                              {item.description}
                            </p>
                          )}
                          <p
                            className="mt-1 text-xs text-gray-700"
                            style={{ color: mode === "dark" ? "white" : "" }}
                          >
                            Price: ${item.price}
                          </p>
                          <p
                            className="mt-1 text-xs text-gray-700"
                            style={{ color: mode === "dark" ? "white" : "" }}
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-center text-2xl text-white">No Orders</h2>
        )}
      </div>
    </Layout>
  );
};

export default Order;
