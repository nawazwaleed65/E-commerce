import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cart")) ?? [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.push(action.payload);
    },
    deleteCart(state, action) {
      const updatedCart = state.filter((item) => item.id !== action.payload.id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart; // ✅ return the new filtered array
    },
  },
});

export const { addToCart, deleteCart } = cartSlice.actions;
export default cartSlice.reducer;
