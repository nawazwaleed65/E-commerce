import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { AiFillShopping, AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import myContext from "../../Context/context";
import Layout from "../../components/layout/layout";
import { fireDB } from "../../Firebase/Firebase";

function ViewOrder() {
  const context = useContext(myContext);
  const { mode, loading } = context;
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const goToAdd = () => {
    window.location.href = "/addProduct";
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "orders"));
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

  return (
    <Layout>
      <div>
        <div className="container mx-auto">
          <div className="tab container mx-auto ">
            <Tabs defaultIndex={0} className=" ">
              <TabList className="md:flex md:space-x-8 bg-  grid grid-cols-2 text-center gap-4   md:justify-center mb-10 ">
                <Tab>
                  <button
                    type="button"
                    className="font-medium border-b-2 border-pink-500 bg-[#605d5d12] text-pink-500  hover:shadow-pink-700  rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]    px-5 py-1.5 text-center "
                  >
                    <div className="flex gap-2 items-center">
                      <AiFillShopping /> Order
                    </div>
                  </button>
                </Tab>
              </TabList>

              {/* order  */}
              <TabPanel>
                <div className="relative overflow-x-auto mb-16">
                  <h1
                    className="text-center mb-5 text-3xl font-semibold underline"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    Order Details
                  </h1>

                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No orders found.
                    </p>
                  ) : (
                    orders.map((orderDoc) => (
                      <table
                        key={orderDoc.id}
                        className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-8"
                      >
                        <thead
                          className="text-xs text-black uppercase bg-gray-200 "
                          style={{
                            backgroundColor:
                              mode === "dark" ? "rgb(46 49 55)" : "",
                            color: mode === "dark" ? "white" : "",
                          }}
                        >
                          <tr>
                            <th className="px-6 py-3">S.No.</th>
                            <th className="px-6 py-3">Payment Id</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Address</th>
                            <th className="px-6 py-3">Pincode</th>
                            <th className="px-6 py-3">Phone Number</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {orderDoc.products.map((item, index) => (
                            <tr
                              key={index}
                              className="bg-gray-50 border-b dark:border-gray-700"
                              style={{
                                backgroundColor:
                                  mode === "dark" ? "rgb(46 49 55)" : "",
                                color: mode === "dark" ? "white" : "",
                              }}
                            >
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4">
                                {orderDoc.sessionId}
                              </td>
                              <td className="px-6 py-4">
                                <img
                                  className="w-16"
                                  src={item.imageUrl}
                                  alt={item.title}
                                />
                              </td>
                              <td className="px-6 py-4">{item.title}</td>
                              <td className="px-6 py-4">${item.price}</td>
                              <td className="px-6 py-4">{item.quantity}</td>
                              <td className="px-6 py-4">
                                {orderDoc.addressInfo?.name || "-"}
                              </td>
                              <td className="px-6 py-4">
                                {orderDoc.addressInfo?.address || "-"}
                              </td>
                              <td className="px-6 py-4">
                                {orderDoc.addressInfo?.pincode || "-"}
                              </td>
                              <td className="px-6 py-4">
                                {orderDoc.addressInfo?.phoneNumber || "-"}
                              </td>
                              <td className="px-6 py-4">
                                {orderDoc.userEmail}
                              </td>
                              <td className="px-6 py-4">
                                {orderDoc.createdAt
                                  ? new Date(
                                      orderDoc.createdAt.seconds * 1000
                                    ).toLocaleString()
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default ViewOrder;
