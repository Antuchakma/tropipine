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

  const isOutOfStock = product.stockQty === 0
  const isLowStock = !isOutOfStock && product.stockQty > 0 && product.stockQty <= (product.lowStockThreshold || 5)

  return (
    <div className="group relative flex flex-col border border-transparent hover:border-stone transition-colors duration-300 pb-4 -mb-4">
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden bg-bone aspect-[4/5]"
      >
        <img
          src={primaryImage || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-bark text-white text-[10px] font-medium px-2 py-0.5 tracking-wider">
              -{discount}%
            </span>
          )}
          {product.isExclusive && (
            <span className="bg-grove text-white text-[10px] font-medium px-2 py-0.5 tracking-widest uppercase">
              Exclusive
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); handleWishlist() }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 ${
            isInWishlist ? 'text-bark bg-white' : 'text-bark/50 bg-white/60 hover:bg-white hover:text-bark'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-cream/70 flex items-center justify-center">
            <span className="bg-bark text-white text-xs px-4 py-1.5 tracking-widest uppercase font-medium">Sold Out</span>
          </div>
        )}

        {/* Added feedback */}
        {justAdded && (
          <div className="absolute inset-0 bg-grove/20 flex items-center justify-center">
            <span className="bg-grove text-white text-xs px-4 py-1.5 tracking-widest uppercase font-medium">Added</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        {product.category && (
          <span className="label text-clay/70">{product.category.name}</span>
        )}

        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-bark leading-snug hover:text-grove transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.origin && (
          <p className="text-xs text-clay/60">{product.origin}</p>
        )}

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((i) => (
              <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                fill={i <= Math.round(product.avgRating) ? '#C4923A' : 'none'}
                stroke="#C4923A" strokeWidth="1.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-[10px] text-clay/60 ml-0.5">({product.avgRating})</span>
          </div>
        )}

        {/* Price + action */}
        <div className="flex items-end justify-between mt-2">
          <div>
            {discount > 0 && (
              <p className="text-[11px] text-clay line-through leading-none mb-0.5">
                ৳{product.basePrice}/{product.unit}
              </p>
            )}
            <p className="font-display text-lg font-normal text-bark leading-none">
              ৳{product.finalPrice || product.basePrice}
              <span className="text-xs text-clay font-sans ml-1">/{product.unit || 'kg'}</span>
            </p>
          </div>

          {isLowStock && (
            <span className="text-[10px] text-clay/70 tracking-wide">{product.stockQty} left</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-2 w-full py-2 text-xs font-medium tracking-widest uppercase transition-all duration-200 ${
            isOutOfStock
              ? 'bg-bone text-clay cursor-not-allowed'
              : justAdded
              ? 'bg-grove text-white'
              : 'bg-transparent border border-bark text-bark hover:bg-bark hover:text-white'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : justAdded ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
