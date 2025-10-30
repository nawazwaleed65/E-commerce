import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Stripe from "stripe";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./firebaseServiceAccount.json", "utf8")
);

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const fireDB = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const stripe = new Stripe(
  "sk_test_51SN9PSCZJwMTyX7B3L5rk0FjXy2AwQsq4GlRMljFONvxHPb672xAPwu383gL0jh8t5pxWYImEgREA87Vy9pSP99o00n1ooIOGy"
);

app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products, user } = req.body;
    console.log("Received:", req.body);

    if (!products || !user) {
      return res.status(400).json({ error: "Missing user or products" });
    }

    const line_items = products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image || "https://via.placeholder.com/150"],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        userEmail: user.email,
      },
    });
    console.log('ok',session)
    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.post("/api/save-order", async (req, res) => {
  try {
    const { user, products, paymentSessionId } = req.body;

    console.log("🟡 Incoming Order Payload:", JSON.stringify(req.body, null, 2));

    if (!user || !products || products.length === 0) {
      console.error("❌ Missing user or products:", { user, products });
      return res.status(400).json({ error: "Missing user or products" });
    }

    if (!fireDB) {
      console.error("❌ Firestore not initialized!");
      return res.status(500).json({ error: "Firestore not connected" });
    }

    const sanitizedProducts = products.map((item) => ({
      title: item.title || "Untitled Product",
      price: item.price || 0,
      quantity: item.quantity || 1,
      imageUrl:
        item.imageUrl || item.image || "https://via.placeholder.com/150",
      description: item.description || "",
    }));

    const orderData = {
      userEmail: user.email || "guest@example.com",
      products: sanitizedProducts,
      paymentStatus: "paid",
      status: "confirmed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      sessionId: paymentSessionId,
    };

    const docRef = await fireDB.collection("orders").add(orderData);

    console.log("✅ Order saved successfully:", docRef.id);
    res.status(200).json({ message: "✅ Order saved successfully" });
  } catch (error) {
    console.error("🔥 Backend Order Save Error:", error);
    res.status(500).json({ error: error.message || "Failed to save order" });
  }
});


app.get("/api/get-orders/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const snapshot = await fireDB
      .collection("orders")
      .where("userEmail", "==", email)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));