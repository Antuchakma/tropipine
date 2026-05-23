import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import api from '../services/api'
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist.items)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const isInWishlist = wishlist.some((item) => item.productId === parseInt(id))

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.finalPrice || product.price,
        quantity,
        image: product.image,
      })
    )
    navigate('/cart')
  }

  const handleWishlist = () => {
    if (!product) return
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(
        addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.finalPrice || product.price,
          image: product.image,
        })
      )
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!product) return <div className="text-center py-12">Product not found</div>

  const discount = product.basePrice && product.finalPrice
    ? Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow">
          {/* Image */}
          <div>
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full rounded-lg"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {product.origin && (
              <p className="text-sm text-gray-500 mb-4">📍 Origin: {product.origin}</p>
            )}

            {/* Pricing */}
            <div className="mb-6 pb-6 border-b">
              {discount > 0 && (
                <span className="text-gray-500 line-through">৳{product.basePrice}</span>
              )}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-green-600">
                  ৳{product.finalPrice || product.price}
                </span>
                {discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <p
                className={`text-sm font-semibold ${
                  product.stockQty > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.stockQty > 0 ? `In Stock (${product.stockQty})` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center gap-2 border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockQty}
                  className="px-3 py-2 disabled:text-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50"
              >
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
