import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { removeFromWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'

export default function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist.items)
  const dispatch = useDispatch()

  const handleAddToCart = (item) => {
    dispatch(addToCart({ productId: item.productId, name: item.name, price: item.price, quantity: 1, image: item.image }))
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-16 px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <svg className="w-10 h-10 text-clay/30 mx-auto mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h1 className="font-display text-3xl font-normal text-bark mb-3">Your wishlist is empty</h1>
          <p className="text-clay text-sm mb-8">Save items you love to revisit them anytime.</p>
          <Link to="/shop" className="px-8 py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors">
            Browse Shop
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="label text-clay/60 mb-2">Account</p>
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-bark">
            Wishlist <span className="text-clay font-sans text-lg font-normal">({wishlist.length})</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {wishlist.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <Link to={`/product/${item.productId}`} className="block aspect-[4/5] bg-bone overflow-hidden mb-3">
                <img
                  src={item.image || 'https://via.placeholder.com/250'}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <Link to={`/product/${item.productId}`} className="block text-sm font-medium text-bark hover:text-grove transition-colors mb-1">
                {item.name}
              </Link>
              <p className="font-display text-base text-bark mb-3">৳{item.price}</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-2 border border-bark text-bark text-xs font-medium tracking-wide hover:bg-bark hover:text-white transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(item.productId))}
                  className="w-full py-2 border border-stone text-clay text-xs hover:border-bark hover:text-bark transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
