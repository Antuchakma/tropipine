import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import api from '../services/api'

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24"
            fill={s <= (hovered || value) ? '#C4923A' : 'none'}
            stroke="#C4923A" strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  )
}

function Stars({ rating, size = 14 }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#C4923A' : 'none'}
          stroke="#C4923A" strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist.items)
  const { user } = useSelector((state) => state.auth)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)

  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [hasReviewed, setHasReviewed] = useState(false)

  const isInWishlist = wishlist.some((item) => item.productId === id)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => { setProduct(r.data); setSelectedImage(r.data.images?.find((i) => i.isPrimary)?.url || r.data.images?.[0]?.url) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    api.get(`/reviews/product/${id}`)
      .then((r) => {
        setReviews(r.data.data || [])
        setAvgRating(r.data.avgRating || 0)
        if (user) setHasReviewed((r.data.data || []).some((rv) => rv.user?.id === user.id))
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false))
  }, [id, user])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart({ productId: product.id, name: product.name, price: product.finalPrice, quantity, image: selectedImage }))
    navigate('/cart')
  }

  const handleWishlist = () => {
    if (!product) return
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist({ productId: product.id, name: product.name, price: product.finalPrice, image: selectedImage }))
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewRating) { setReviewError('Please select a rating'); return }
    setReviewSubmitting(true)
    setReviewError('')
    try {
      await api.post('/reviews', { productId: product.id, rating: reviewRating, comment: reviewComment.trim() || undefined })
      setReviewSuccess(true)
      setReviewRating(0)
      setReviewComment('')
      setHasReviewed(true)
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border border-bark border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-normal text-bark mb-4">Product not found</p>
          <button onClick={() => navigate('/shop')} className="label text-clay border-b border-stone hover:text-bark hover:border-bark transition-colors pb-0.5">
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const discount = product.basePrice && product.finalPrice && product.finalPrice < product.basePrice
    ? Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-14 space-y-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-clay/60">
          <button onClick={() => navigate('/shop')} className="hover:text-bark transition-colors">Shop</button>
          <span>/</span>
          {product.category && <span>{product.category.name}</span>}
          {product.category && <span>/</span>}
          <span className="text-bark">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-[4/5] bg-bone overflow-hidden">
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`flex-shrink-0 w-16 h-16 overflow-hidden transition-all ${
                      selectedImage === img.url ? 'ring-1 ring-bark' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <p className="label text-clay/60 mb-3">{product.category.name}</p>
            )}

            <h1 className="font-display text-4xl sm:text-5xl font-normal text-bark leading-none mb-3">
              {product.name}
            </h1>

            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={avgRating} />
                <span className="text-xs text-clay">{avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 py-5 border-y border-stone">
              <span className="font-display text-4xl font-normal text-bark">৳{product.finalPrice}</span>
              <span className="text-sm text-clay">/{product.unit || 'kg'}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-clay line-through">৳{product.basePrice}</span>
                  <span className="label text-grove">−{discount}%</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-clay leading-relaxed mb-5 text-sm">{product.description}</p>
            )}

            {product.origin && (
              <p className="text-xs text-clay/70 mb-5">
                <span className="font-medium text-bark">Origin:</span> {product.origin}
              </p>
            )}

            {/* Stock */}
            <p className={`text-xs mb-6 ${product.stockQty > 0 ? 'text-grove' : 'text-clay/60'}`}>
              {product.stockQty > 0 ? `In Stock — ${product.stockQty} ${product.unit} available` : 'Out of Stock'}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="label text-clay/60">Quantity</span>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                  className="w-9 h-9 border border-stone text-clay hover:border-bark hover:text-bark transition-colors flex items-center justify-center text-sm"
                >
                  −
                </button>
                <span className="w-12 h-9 border-y border-stone text-center text-sm text-bark flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockQty}
                  className="w-9 h-9 border border-stone text-clay hover:border-bark hover:text-bark transition-colors flex items-center justify-center text-sm disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                className="w-full py-3.5 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-40"
              >
                {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`w-full py-3.5 border text-sm font-medium tracking-wide transition-colors ${
                  isInWishlist
                    ? 'bg-bark text-white border-bark'
                    : 'border-stone text-clay hover:border-bark hover:text-bark'
                }`}
              >
                {isInWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="label text-clay/60 px-3 py-1 border border-stone text-[10px]">{tag}</span>
                ))}
              </div>
            )}

            {/* Delivery promise */}
            <div className="border border-stone p-5 space-y-3 bg-white">
              <p className="label text-clay/60 text-[10px] mb-3">Delivery & Quality</p>
              {[
                { icon: '⟳', text: 'Harvested within 24 hours of your order' },
                { icon: '⬡', text: 'Same-day delivery available in Dhaka' },
                { icon: '✓', text: 'Freshness guaranteed — or full refund' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-grove text-xs mt-0.5 flex-shrink-0">{item.icon}</span>
                  <p className="text-xs text-clay leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-stone pt-14">
          <h2 className="font-display text-3xl font-normal text-bark mb-10">
            Customer Reviews
            {avgRating > 0 && <span className="text-clay font-sans text-base font-normal ml-3">({avgRating} avg)</span>}
          </h2>

          <div className="grid lg:grid-cols-2 gap-14">
            {/* Review list */}
            <div className="space-y-5">
              {reviewsLoading ? (
                [...Array(2)].map((_, i) => <div key={i} className="h-20 bg-white border border-stone animate-pulse" />)
              ) : reviews.length === 0 ? (
                <div className="bg-white border border-stone p-10 text-center">
                  <p className="font-display text-xl font-normal text-bark mb-1">No reviews yet</p>
                  <p className="text-clay text-sm">Be the first to share your experience.</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-stone p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-bark flex items-center justify-center text-white text-xs font-medium">
                          {review.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-bark">{review.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-clay/60">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <Stars rating={review.rating} size={12} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-clay leading-relaxed italic">"{review.comment}"</p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Submit review */}
            <div className="bg-white border border-stone p-8">
              <h3 className="font-display text-xl font-normal text-bark mb-5">Write a Review</h3>
              {!user ? (
                <div className="text-center py-6">
                  <p className="text-clay text-sm mb-4">Sign in to leave a review</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 bg-bark text-white text-xs font-medium tracking-wide hover:bg-earth transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              ) : hasReviewed || reviewSuccess ? (
                <div className="text-center py-6">
                  <p className="font-display text-xl font-normal text-bark mb-1">Thank you</p>
                  <p className="text-clay text-sm">Your review is pending approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="label text-clay/70 block mb-2">Your Rating</label>
                    <StarPicker value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div>
                    <label className="label text-clay/70 block mb-2">Comment (optional)</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Share your honest experience…"
                      className="w-full px-4 py-3 bg-cream border border-stone text-bark text-sm placeholder-sand focus:outline-none focus:border-bark transition-colors resize-none"
                    />
                  </div>
                  {reviewError && <p className="text-earth text-xs">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewRating}
                    className="w-full py-3 bg-bark text-white text-sm font-medium tracking-wide hover:bg-earth transition-colors disabled:opacity-40"
                  >
                    {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
