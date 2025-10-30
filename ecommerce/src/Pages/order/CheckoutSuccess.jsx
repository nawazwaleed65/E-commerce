import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fireDB } from "../../Firebase/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Layout from "../../components/layout/layout";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        const paymentSessionId = localStorage.getItem("paymentSessionId");

        if (!user || !cartItems || cartItems.length === 0) {
          console.error("❌ Missing user or cart items");
          return;
        }

        const sanitizedProducts = cartItems.map((item) => ({
          title: item.title || "Untitled Product",
          price: item.price || 0,
          quantity: item.quantity || 1,
          imageUrl:
            item.imageUrl || item.image || "https://via.placeholder.com/150",
        }));

        const total = sanitizedProducts.reduce(
          (sum, p) => sum + Number(p.price) * Number(p.quantity),
          0
        );

        // 🗂️ Save order in Firestore
        const docRef = await addDoc(collection(fireDB, "orders"), {
          userEmail: user.email,
          products: sanitizedProducts,
          total,
          paymentStatus: "paid",
          status: "confirmed",
          sessionId: paymentSessionId || "N/A",
          createdAt: serverTimestamp(),
        });

        console.log("✅ Order saved to Firestore:", docRef.id);

        // 🧹 Clear cart and session
        localStorage.removeItem("cartItems");
        localStorage.removeItem("paymentSessionId");

        // ✅ Redirect to success page
        setTimeout(() => navigate("/success"), 1000);
      } catch (error) {
        console.error("🔥 Error saving order:", error);
      }
    };

    saveOrder();
  }, [navigate]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            Processing your payment...
          </h2>
          <p className="mt-2 text-gray-500">
            Please wait while we confirm your order.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
