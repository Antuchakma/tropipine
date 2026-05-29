import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice'
import api from '../services/api'
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa'

function StarDisplay({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 20 : 14
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating ? (
          <FaStar key={s} size={sz} className="text-amber-400" />
        ) : (
          <FaRegStar key={s} size={sz} className="text-amber-300" />
        )
      )}
    </span>
  )
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          {s <= (hovered || value) ? (
            <FaStar size={28} className="text-amber-400" />
          ) : (
            <FaRegStar size={28} className="text-amber-300" />
          )}
        </button>
      ))}
    </div>
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

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true)
      try {
        const res = await api.get(`/reviews/product/${id}`)
        setReviews(res.data.data || [])
        setAvgRating(res.data.avgRating || 0)
        if (user) {
          const already = (res.data.data || []).some((r) => r.user?.id === user.id)
          setHasReviewed(already)
        }
      } catch {
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }
    fetchReviews()
  }, [id, user])

  const handleAddToCart = () => {
    if (!product) return
    const primaryImg = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.finalPrice,
        quantity,
        image: primaryImg,
      })
    )
    navigate('/cart')
  }

  const handleWishlist = () => {
    if (!product) return
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      const primaryImg = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url
      dispatch(
        addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.finalPrice,
          image: primaryImg,
        })
      )
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewRating) {
      setReviewError('Please select a star rating')
      return
    }
    setReviewSubmitting(true)
    setReviewError('')
    try {
      await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      })
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
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }
  if (!product) return <div className="text-center py-12">Product not found</div>

  const primaryImage = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url
  const discount = product.basePrice && product.finalPrice
    ? Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-warm py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Product Card */}
        <div className="grid md:grid-cols-2 gap-12 bg-white border border-warm-border p-10 rounded-3xl shadow-sm">
          {/* Image */}
          <div>
            <img
              src={primaryImage || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full rounded-3xl object-cover aspect-square"
            />
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={img.altText || product.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-warm-border cursor-pointer hover:border-accent transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.category && (
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                {product.category.name}
              </span>
            )}
            <h1 className="text-4xl font-black mt-1 mb-3 text-ink">{product.name}</h1>

            {/* Average rating badge */}
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarDisplay rating={Math.round(avgRating)} size="sm" />
                <span className="text-sm text-ink-muted font-medium">
                  {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <p className="text-ink-muted mb-5 text-lg leading-relaxed">{product.description}</p>

            {product.origin && (
              <p className="text-sm text-accent mb-6 font-medium">Origin: {product.origin}</p>
            )}

            {/* Pricing */}
            <div className="mb-8 pb-8 border-b border-warm-border">
              {discount > 0 && (
                <span className="text-ink-muted line-through block mb-2">{product.basePrice}</span>
              )}
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-accent">{product.finalPrice}</span>
                {discount > 0 && (
                  <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <p className={`text-sm font-semibold ${product.stockQty > 0 ? 'text-accent' : 'text-ink-muted'}`}>
                {product.stockQty > 0 ? `In Stock (${product.stockQty} ${product.unit})` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
              <label className="font-medium text-ink-muted">Quantity:</label>
              <div className="flex items-center gap-2 border border-warm-border rounded-2xl bg-warm">
                <button
                  onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                  className="px-4 py-2 text-accent hover:bg-warm-border rounded-l-2xl transition"
                >
                  −
                </button>
                <span className="px-6 font-medium text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockQty}
                  className="px-4 py-2 text-accent hover:bg-warm-border rounded-r-2xl transition disabled:opacity-50"
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
                className="w-full bg-accent text-white py-4 rounded-2xl hover:bg-accent-dark disabled:opacity-50 font-semibold transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`w-full flex items-center justify-center gap-2 border-2 py-4 rounded-2xl font-semibold transition ${
                  isInWishlist
                    ? 'bg-accent text-white border-accent'
                    : 'border-warm-border text-accent bg-white hover:border-accent'
                }`}
              >
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-warm border border-warm-border rounded-full text-xs text-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-warm-border rounded-3xl p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-ink">Customer Reviews</h2>
              {avgRating > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-4xl font-black text-accent">{avgRating}</span>
                  <div>
                    <StarDisplay rating={Math.round(avgRating)} size="lg" />
                    <p className="text-sm text-ink-muted mt-1">{reviews.length} verified review{reviews.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Review List */}
            <div>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse bg-warm rounded-2xl h-24" />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-ink-muted">
                  <div className="text-4xl mb-3">⭐</div>
                  <p className="font-medium">No reviews yet — be the first!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-warm-border rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                            {review.user?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-ink text-sm">{review.user?.name || 'Anonymous'}</p>
                            <p className="text-xs text-ink-muted">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <StarDisplay rating={review.rating} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-ink-muted text-sm leading-relaxed mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="border border-warm-border rounded-2xl p-6 bg-warm/50">
              <h3 className="text-lg font-black text-ink mb-4">Write a Review</h3>

              {!user ? (
                <div className="text-center py-6">
                  <p className="text-ink-muted mb-4">Sign in to leave a review</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-accent text-white px-6 py-2 rounded-2xl font-semibold hover:bg-accent-dark transition"
                  >
                    Sign In
                  </button>
                </div>
              ) : hasReviewed ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">✓</div>
                  <p className="text-ink-muted font-medium">You&apos;ve already reviewed this product</p>
                  {reviewSuccess && (
                    <p className="text-green-600 text-sm mt-2">Your review is pending approval</p>
                  )}
                </div>
              ) : reviewSuccess ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-green-700 font-semibold">Review submitted!</p>
                  <p className="text-ink-muted text-sm mt-1">It will appear after approval</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Your Rating *</label>
                    <StarPicker value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-2">Comment (optional)</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience with this product..."
                      className="w-full px-4 py-3 border border-warm-border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-accent text-ink resize-none"
                    />
                  </div>
                  {reviewError && (
                    <p className="text-red-600 text-sm">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewRating}
                    className="w-full bg-accent text-white py-3 rounded-2xl hover:bg-accent-dark disabled:opacity-50 font-semibold transition"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
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
