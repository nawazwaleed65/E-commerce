import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice"; // ✅ import the default export

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
