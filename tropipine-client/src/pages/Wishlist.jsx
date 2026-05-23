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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8">Add fruits to your wishlist to save them for later!</p>
        <Link
          to="/shop"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        <div className="grid md:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={item.image || 'https://via.placeholder.com/250x200'}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-green-600 font-bold mb-4">৳{item.price}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(item.productId))}
                  className="w-full bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 flex items-center justify-center gap-2"
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
