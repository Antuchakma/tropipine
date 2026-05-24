import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
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
      <div className="min-h-screen bg-[#F6F1E8] flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-black mb-4 text-[#1E1E1E]">Your Wishlist is Empty</h1>
        <p className="text-[#6A625B] mb-8 text-lg">Add fruits to your wishlist to save them for later!</p>
        <Link
          to="/shop"
          className="bg-[#8B5E3C] text-white px-8 py-3 rounded-2xl hover:bg-[#7a4e2f] font-semibold transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-10 text-[#1E1E1E]">My Wishlist</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.productId} className="bg-white border border-[#E7DBCF] rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition">
              <img
                src={item.image || 'https://via.placeholder.com/250x200'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold mb-2 text-[#1E1E1E]">{item.name}</h3>
                <p className="text-[#8B5E3C] font-bold mb-5">৳{item.price}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-[#8B5E3C] text-white py-2 rounded-2xl hover:bg-[#7a4e2f] mb-2 font-medium transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(item.productId))}
                  className="w-full bg-[#F6F1E8] border border-[#E7DBCF] text-[#8B5E3C] py-2 rounded-2xl hover:bg-[#E7DBCF] flex items-center justify-center gap-2 font-medium transition"
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
  )
}
