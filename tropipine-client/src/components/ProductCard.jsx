import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import {
  addToWishlist,
  removeFromWishlist,
} from '../store/slices/wishlistSlice'

import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
} from 'react-icons/fa'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()

  const wishlist = useSelector((state) => state.wishlist.items)

  const isInWishlist = wishlist.some(
    (item) => item.productId === product.id
  )

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.finalPrice || product.price,
        quantity: 1,
        image: product.image,
      })
    )
  }

  const handleWishlist = () => {
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

  const discount =
    product.basePrice && product.finalPrice
      ? Math.round(
          ((product.basePrice - product.finalPrice) /
            product.basePrice) *
            100
        )
      : 0

  return (
    <div
      className="
        group
        bg-white
        border border-[#E7DBCF]
        rounded-[28px]
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]
      "
    >
      {/* ================= IMAGE ================= */}
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-[#F6F1E8] h-64">
          <img
            src={
              product.image ||
              'https://via.placeholder.com/400x300?text=No+Image'
            }
            alt={product.name}
            className="
              w-full h-full object-cover
              transition duration-500
              group-hover:scale-105
            "
          />

          {/* FEATURED */}
          {product.isFeatured && (
            <div
              className="
                absolute top-4 left-4
                bg-white/90 backdrop-blur-md
                border border-[#E7DBCF]
                text-[#8B5E3C]
                px-3 py-1
                rounded-full
                text-[11px]
                font-semibold
                tracking-wide
              "
            >
              Featured
            </div>
          )}

          {/* DISCOUNT */}
          {discount > 0 && (
            <div
              className="
                absolute top-4 right-4
                bg-[#1F1F1F]
                text-white
                px-3 py-1
                rounded-full
                text-[11px]
                font-semibold
              "
            >
              -{discount}%
            </div>
          )}

          {/* LOW STOCK */}
          {product.stockQty && product.stockQty < 20 && (
            <div
              className="
                absolute bottom-4 left-4
                bg-[#F6F1E8]/90
                backdrop-blur-md
                border border-[#E7DBCF]
                text-[#8B5E3C]
                px-3 py-1
                rounded-full
                text-[11px]
                font-medium
              "
            >
              Low Stock
            </div>
          )}
        </div>
      </Link>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* TITLE */}
        <Link to={`/product/${product.id}`}>
          <h3
            className="
              text-lg font-semibold
              text-[#1E1E1E]
              leading-snug
              mb-2
              line-clamp-2
              hover:text-[#8B5E3C]
              transition-colors duration-300
            "
          >
            {product.name}
          </h3>
        </Link>

        {/* DESCRIPTION */}
        <p
          className="
            text-sm text-[#6A625B]
            leading-relaxed
            line-clamp-2
            mb-5
          "
        >
          {product.description}
        </p>

        {/* PRICE + WISHLIST */}
        <div className="flex items-start justify-between mb-5">
          <div>
            {discount > 0 && (
              <p className="text-sm text-[#9B928A] line-through">
                ৳{product.basePrice}
              </p>
            )}

            <h2 className="text-2xl font-bold text-[#1E1E1E]">
              ৳{product.finalPrice || product.price}
            </h2>
          </div>

          <button
            onClick={handleWishlist}
            className="
              w-11 h-11
              rounded-2xl
              border border-[#E7DBCF]
              bg-[#F6F1E8]
              flex items-center justify-center
              transition-all duration-300
              hover:border-[#8B5E3C]
              hover:text-[#8B5E3C]
            "
          >
            {isInWishlist ? (
              <FaHeart className="text-[#8B5E3C]" />
            ) : (
              <FaRegHeart className="text-[#5A5149]" />
            )}
          </button>
        </div>

        {/* RATING */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={12}
                className={
                  i < product.rating
                    ? 'text-[#D4A373]'
                    : 'text-[#DDD6CF]'
                }
              />
            ))}

            <span className="text-xs text-[#8A817A] ml-1">
              ({product.reviews})
            </span>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQty === 0}
          className="
            w-full
            bg-[#1F1F1F]
            hover:bg-black
            text-white
            py-3.5
            rounded-2xl
            font-medium
            transition-all duration-300
            flex items-center justify-center gap-2
            disabled:bg-[#B8B0A8]
            disabled:cursor-not-allowed
          "
        >
          <FaShoppingCart size={15} />

          {product.stockQty === 0
            ? 'Out of Stock'
            : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}