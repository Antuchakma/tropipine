import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  couponCode: null,
  couponDiscount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (item) {
        item.quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          productId: action.payload.productId,
          name: action.payload.name,
          price: action.payload.price,
          quantity: action.payload.quantity || 1,
          image: action.payload.image,
        })
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      state.couponCode = null
      state.couponDiscount = 0
      localStorage.removeItem('cart')
    },
    setCoupon: (state, action) => {
      state.couponCode = action.payload.code
      state.couponDiscount = action.payload.discount
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCoupon } = cartSlice.actions
export default cartSlice.reducer
