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
    <div className="min-h-screen bg-[#F6F1E8] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 bg-white border border-[#E7DBCF] p-10 rounded-3xl shadow-sm">
          {/* Image */}
          <div>
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full rounded-3xl"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-black mb-3 text-[#1E1E1E]">{product.name}</h1>
            <p className="text-[#6A625B] mb-5 text-lg leading-relaxed">{product.description}</p>

            {product.origin && (
              <p className="text-sm text-[#8B5E3C] mb-6 font-medium"> Origin: {product.origin}</p>
            )}

            {/* Pricing */}
            <div className="mb-8 pb-8 border-b border-[#E7DBCF]">
              {discount > 0 && (
                <span className="text-[#6A625B] line-through block mb-2">{product.basePrice}</span>
              )}
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-[#8B5E3C]">
                  {product.finalPrice || product.price}
                </span>
                {discount > 0 && (
                  <span className="bg-[#8B5E3C] text-white px-4 py-2 rounded-full text-sm font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <p
                className={`text-sm font-semibold ${
                  product.stockQty > 0 ? 'text-[#8B5E3C]' : 'text-[#6A625B]'
                }`}
              >
                {product.stockQty > 0 ? ` In Stock (${product.stockQty})` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
              <label className="font-medium text-[#5A5149]">Quantity:</label>
              <div className="flex items-center gap-2 border border-[#E7DBCF] rounded-2xl bg-[#F6F1E8]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-[#8B5E3C] hover:bg-[#E7DBCF] rounded-l-2xl transition"
                >

                </button>
                <span className="px-6 font-medium text-[#1E1E1E]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockQty}
                  className="px-4 py-2 text-[#8B5E3C] hover:bg-[#E7DBCF] rounded-r-2xl transition disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                className="w-full bg-[#8B5E3C] text-white py-4 rounded-2xl hover:bg-[#7a4e2f] disabled:opacity-50 font-semibold transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`w-full flex items-center justify-center gap-2 border-2 py-4 rounded-2xl font-semibold transition ${
                  isInWishlist
                    ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                    : 'border-[#E7DBCF] text-[#8B5E3C] bg-white hover:border-[#8B5E3C]'
                }`}
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
