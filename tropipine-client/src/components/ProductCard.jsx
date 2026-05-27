import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import { motion } from 'framer-motion'
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const wishlist = useSelector((s) => s.wishlist.items)
  const isInWishlist = wishlist.some((i) => i.productId === product.id)

  const primaryImage = product.images?.find((i) => i.isPrimary)?.url
    || product.images?.[0]?.url
    || product.image

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: product.finalPrice || product.basePrice,
      quantity: product.minOrderQty || 1,
      unit: product.unit || 'kg',
      image: primaryImage,
    }))
  }

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.finalPrice || product.basePrice,
        image: primaryImage,
      }))
    }
  }

  const discount = product.basePrice && product.finalPrice && product.finalPrice < product.basePrice
    ? Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100)
    : 0

  const isOutOfStock = product.stockQty === 0
  const isLowStock = !isOutOfStock && product.stockQty > 0 && product.stockQty <= (product.lowStockThreshold || 5)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl overflow-hidden border border-edge shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col h-full"
    >
      {/* IMAGE */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-surface h-56 flex-shrink-0">
        <img
          src={primaryImage || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist btn */}
        <button
          onClick={(e) => { e.preventDefault(); handleWishlist() }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-2xl flex items-center justify-center backdrop-blur-sm border transition-all duration-200 z-10 ${
            isInWishlist
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'bg-white/80 border-white/60 text-ink-muted hover:text-brand-500 hover:border-brand-300'
          }`}
        >
          {isInWishlist ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold gradient-brand text-white shadow-brand">
              -{discount}%
            </span>
          )}
          {product.isExclusive && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D4A017] text-white">
               Exclusive
            </span>
          )}
          {product.isBestSeller && !product.isExclusive && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-ink border border-edge">
              Best Seller
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-ink text-white text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1 h-full">
        {/* Category */}
        {product.category && (
          <span className="text-[11px] uppercase tracking-wider text-brand-500 font-semibold mb-2">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-base font-bold text-ink leading-tight mb-1 line-clamp-2 h-10 hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Origin */}
        {product.origin && (
          <p className="text-xs text-ink-faint mb-2 h-5"> {product.origin}</p>
        )}

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1.5 mb-2 h-5">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <FaStar key={i} size={11} className={i <= Math.round(product.avgRating) ? 'text-[#F59E0B]' : 'text-edge'} />
              ))}
            </div>
            <span className="text-[11px] text-ink-faint">({product.avgRating})</span>
          </div>
        )}

        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-end justify-between mb-4">
          <div>
            {discount > 0 && (
              <p className="text-xs text-ink-faint line-through leading-none mb-1">{product.basePrice}/{product.unit}</p>
            )}
            <p className="text-xl font-display font-bold text-ink leading-none">
              {product.finalPrice || product.basePrice}
              <span className="text-xs font-normal text-ink-muted ml-1">/{product.unit || 'kg'}</span>
            </p>
          </div>

          {/* Stock pill */}
          {isLowStock && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 whitespace-nowrap">
              Only {product.stockQty} left
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 flex-shrink-0 ${
            isOutOfStock
              ? 'bg-surface text-ink-faint cursor-not-allowed border border-edge'
              : 'gradient-brand text-white shadow-brand hover:shadow-lg hover:opacity-90'
          }`}
        >
          <FaShoppingCart size={13} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  )
}
