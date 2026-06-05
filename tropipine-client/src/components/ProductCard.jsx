import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const wishlist = useSelector((s) => s.wishlist.items)
  const isInWishlist = wishlist.some((i) => i.productId === product.id)
  const [justAdded, setJustAdded] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || ''
  const resolveImg = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
  }
  const primaryImage = resolveImg(
    product.images?.find((i) => i.isPrimary)?.url
    || product.images?.[0]?.url
    || product.imageUrl
    || product.image
  )

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      price: product.finalPrice || product.basePrice,
      quantity: product.minOrderQty || 1,
      unit: product.unit || 'kg',
      image: primaryImage,
    }))
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1200)
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

  const isOutOfStock = product.stockQty === 0 || product.isAvailable === false
  const isLowStock = !isOutOfStock && product.stockQty > 0 && product.stockQty <= (product.lowStockThreshold || 5)

  return (
    // h-full ensures equal height in CSS grid — parent grid must use items-stretch
    <div className="group flex flex-col h-full bg-white border border-stone hover:border-grove transition-colors duration-300">

      {/* ── Image (fixed ratio) ── */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden bg-bone aspect-[4/5] flex-shrink-0"
      >
        <img
          src={primaryImage || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-bark text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider">
              −{discount}%
            </span>
          )}
          {product.isExclusive && (
            <span className="bg-grove text-white text-[10px] font-semibold px-2 py-0.5 tracking-widest uppercase">
              Exclusive
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); handleWishlist() }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 ${
            isInWishlist ? 'bg-grove text-white' : 'bg-white/80 text-bark/60 hover:bg-white hover:text-grove'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-bark text-xs px-5 py-2 tracking-widest uppercase font-bold shadow-md">
              {product.isAvailable === false ? 'Unavailable' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Added feedback */}
        {justAdded && (
          <div className="absolute inset-0 bg-grove/25 flex items-center justify-center">
            <span className="bg-grove text-white text-xs px-4 py-1.5 tracking-widest uppercase font-semibold">Added ✓</span>
          </div>
        )}
      </Link>

      {/* ── Info (grows to fill card height) ── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Top content — grows */}
        <div className="flex-1">
          {product.category && (
            <span className="label text-grove text-[10px]">{product.category.name}</span>
          )}

          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-bark leading-snug hover:text-grove transition-colors mt-1 mb-1 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {product.origin && (
            <p className="text-xs text-clay/60 mb-1">{product.origin}</p>
          )}

          {product.avgRating > 0 && (
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                  fill={i <= Math.round(product.avgRating) ? '#C4923A' : 'none'}
                  stroke="#C4923A" strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span className="text-[10px] text-clay/60">({product.avgRating})</span>
            </div>
          )}
        </div>

        {/* Bottom — price + button always at card base */}
        <div className="mt-3 pt-3 border-t border-stone">
          <div className="flex items-end justify-between mb-3">
            <div>
              {discount > 0 && (
                <p className="text-[11px] text-clay/60 line-through leading-none mb-0.5">
                  ৳{product.basePrice}/{product.unit}
                </p>
              )}
              <p className="font-display text-xl font-semibold text-grove leading-none">
                ৳{product.finalPrice || product.basePrice}
                <span className="text-xs text-clay font-sans font-normal ml-1">/{product.unit || 'kg'}</span>
              </p>
            </div>
            {isLowStock && (
              <span className="text-[10px] text-clay/60 italic">{product.stockQty} left</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
              isOutOfStock
                ? 'bg-bone text-clay/50 cursor-not-allowed'
                : justAdded
                ? 'bg-grove text-white'
                : 'bg-grove text-white hover:bg-bark'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : justAdded ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
