import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Stripe from "stripe";
import admin from "firebase-admin";
import fs from "fs";

// ✅ Load Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync("./firebaseServiceAccount.json", "utf8")
);

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const fireDB = admin.firestore();

const stripe = new Stripe(
  "sk_test_51SN9PSCZJwMTyX7B3L5rk0FjXy2AwQsq4GlRMljFONvxHPb672xAPwu383gL0jh8t5pxWYImEgREA87Vy9pSP99o00n1ooIOGy"
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products, user } = req.body;
    console.log("🟢 Checkout Data:", req.body);

    if (!products || !Array.isArray(products) || products.length === 0)
      return res.status(400).json({ error: "Missing or invalid products" });

    if (!user || !user.email)
      return res.status(400).json({ error: "Missing user info" });

    const line_items = products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title || "Untitled Product",
          images: [
            item.imageUrl || item.image || "https://via.placeholder.com/150", // ✅ default placeholder
          ],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/checkout-success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: { userEmail: user.email },
    });

    console.log("✅ Stripe session created:", session.id);
    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.post("/api/save-order", async (req, res) => {
  try {
    const { user, products, paymentSessionId } = req.body;

    if (!user || !products || products.length === 0)
      return res.status(400).json({ error: "Missing user or products" });

    const sanitizedProducts = products.map((item) => ({
      title: item.title || "Untitled Product",
      price: item.price || 0,
      quantity: item.quantity || 1,
      imageUrl:
        item.imageUrl || item.image || "https://via.placeholder.com/150",
      description: item.description || "",
    }));

    const total = sanitizedProducts.reduce(
      (sum, p) => sum + Number(p.price) * Number(p.quantity),
      0
    );

    const orderData = {
      userEmail: user.email,
      name: user.name || "Guest",
      products: sanitizedProducts,
      total,
      paymentStatus: "paid",
      status: "confirmed",
      sessionId: paymentSessionId || "N/A",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await fireDB.collection("orders").add(orderData);

    console.log("✅ Order saved:", docRef.id);
    res
      .status(200)
      .json({ message: "Order saved successfully", orderId: docRef.id });
  } catch (error) {
    console.error("🔥 Backend Order Save Error:", error);
    res.status(500).json({ error: error.message || "Failed to save order" });
  }
});

// ✅ Get Orders by User Email
app.post("/api/get-orders", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const snapshot = await fireDB
      .collection("orders")
      .where("userEmail", "==", email)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ orders });
  } catch (error) {
    console.error("🔥 Error fetching orders:", error);
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
