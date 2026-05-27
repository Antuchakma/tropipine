import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { removeFromWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'
import { FaTrash } from 'react-icons/fa'

export default function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist.items)
  const dispatch = useDispatch()

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    }))
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <section
          className="relative text-white overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-28 flex items-center justify-center min-h-screen">
            <div className="max-w-2xl space-y-8 text-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-4xl font-black text-white mb-4">Your Wishlist is Empty</h1>
                <p className="text-white/80 mb-8 text-lg">Add fruits to your wishlist to save them for later!</p>
                <Link
                  to="/shop"
                  className="inline-block bg-brand-600 text-white px-8 py-4 rounded-2xl hover:bg-brand-700 font-semibold transition"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-20 flex items-center justify-center">
          <div className="max-w-2xl space-y-4 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">Account</p>
              <h1 className="font-display text-4xl font-black text-white">My Wishlist</h1>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-surface py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-2">Account</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.productId} className="bg-white border border-edge rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition">
                <img
                  src={item.image || 'https://via.placeholder.com/250x200'}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold mb-2 text-ink">{item.name}</h3>
                  <p className="text-brand-600 font-bold mb-5">{item.price}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full gradient-brand text-white py-2 rounded-2xl hover:opacity-90 mb-2 font-medium transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.productId))}
                    className="w-full bg-surface border border-edge text-brand-600 py-2 rounded-2xl hover:bg-edge flex items-center justify-center gap-2 font-medium transition"
                  >
                    <FaTrash size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
