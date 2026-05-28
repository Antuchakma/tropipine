import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  couponCode: null,
  couponDiscount: 0,    // absolute dollar amount off
  couponType: null,     // 'PERCENTAGE' | 'FIXED'
  couponValue: 0,       // original value (e.g. 10 for 10%)
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
      if (item) item.quantity = action.payload.quantity
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      state.couponCode = null
      state.couponDiscount = 0
      state.couponType = null
      state.couponValue = 0
      localStorage.removeItem('cart')
    },
    setCoupon: (state, action) => {
      state.couponCode = action.payload.code
      state.couponDiscount = action.payload.discountAmount || 0
      state.couponType = action.payload.couponType || null
      state.couponValue = action.payload.couponValue || 0
    },
    clearCoupon: (state) => {
      state.couponCode = null
      state.couponDiscount = 0
      state.couponType = null
      state.couponValue = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCoupon, clearCoupon } = cartSlice.actions
export default cartSlice.reducer
