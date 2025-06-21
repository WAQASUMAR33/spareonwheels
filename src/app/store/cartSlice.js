// ./src/app/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (error) {
    console.error("Could not load cart from localStorage", error);
    return [];
  }
};

const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error("Could not save cart to localStorage", error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromLocalStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity } = action.payload;
      console.log("product to cart is ",state.items);
      const existingProduct = state.items.find(item => item.id === id);
      if (existingProduct) {
        existingProduct.quantity += quantity; // Add the selected quantity
      } else {
        state.items.push({ ...action.payload, quantity });
      }
      saveCartToLocalStorage(state.items); // Save updated cart to localStorage
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      saveCartToLocalStorage(state.items); // Save updated cart to localStorage
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        saveCartToLocalStorage(state.items); // Save updated cart to localStorage
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToLocalStorage(state.items); // Save updated cart to localStorage
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToLocalStorage(state.items); // Clear localStorage
    },
  },
});

// Exporting actions and reducer
export const { addToCart, removeFromCart, updateQuantity, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
