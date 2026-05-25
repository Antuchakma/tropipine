import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'

const SORT_OPTIONS = [
  { value: '', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Best Sellers' },
]

const QUICK_FILTERS = [
  { label: 'All', key: null },
  { label: '✦ Exclusive', key: 'isExclusive' },
  { label: '⭐ Best Sellers', key: 'isBestSeller' },
  { label: '🌟 Featured', key: 'isFeatured' },
  { label: '🍃 Seasonal', key: 'isSeasonal' },
  { label: '📦 In Stock', key: 'inStock' },
]

const LIMIT = 12

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('')
  const [activeFilter, setActiveFilter] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Read URL params
  useEffect(() => {
    if (searchParams.get('isExclusive')) setActiveFilter('isExclusive')
  }, [])

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: LIMIT })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy) params.set('sortBy', sortBy)
    if (activeFilter) params.set(activeFilter, 'true')
    if (selectedCategory) params.set('category', selectedCategory)

    api.get(`/products?${params}`)
      .then((r) => { setProducts(r.data.items || []); setTotal(r.data.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, sortBy, activeFilter, selectedCategory])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <div className="bg-white border-b border-edge">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-widest text-brand-500 font-semibold mb-3">Our Collection</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-ink mb-3">Fresh Tropical Fruits</h1>
            <p className="text-ink-muted">
              {total > 0 ? `${total} products available` : 'Browse our curated selection of premium fruits'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint text-sm" />
            <input
              type="text"
              placeholder="Search by name, variety, origin…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-edge bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                <FaTimes size={13} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="px-4 py-3 rounded-2xl border border-edge bg-white text-sm text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => { setActiveFilter(f.key); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeFilter === f.key
                  ? 'gradient-brand text-white border-transparent shadow-brand'
                  : 'bg-white text-ink-muted border-edge hover:border-brand-300 hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedCategory === cat.slug
                  ? 'bg-ink text-white border-transparent'
                  : 'bg-white text-ink-muted border-edge hover:border-ink-muted hover:text-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-edge overflow-hidden animate-pulse">
                  <div className="h-56 bg-edge" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-edge rounded-full w-1/4" />
                    <div className="h-5 bg-edge rounded-full w-3/5" />
                    <div className="h-3 bg-edge rounded-full w-2/5" />
                    <div className="h-10 bg-edge rounded-2xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              key={`${page}-${activeFilter}-${debouncedSearch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-3xl border border-edge"
            >
              <p className="text-5xl mb-4">🍃</p>
              <h3 className="font-display text-xl font-bold text-ink mb-2">No products found</h3>
              <p className="text-ink-muted text-sm mb-6">Try clearing your filters or searching for something else.</p>
              <button
                onClick={() => { setSearch(''); setActiveFilter(null); setSelectedCategory(''); setSortBy('') }}
                className="px-6 py-3 rounded-2xl gradient-brand text-white text-sm font-semibold shadow-brand hover:opacity-90 transition"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl border border-edge bg-white text-sm font-medium text-ink-muted hover:text-ink hover:border-brand-300 disabled:opacity-40 transition"
            >
              ← Previous
            </button>
            <div className="flex gap-1.5">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      page === p
                        ? 'gradient-brand text-white shadow-brand'
                        : 'bg-white border border-edge text-ink-muted hover:border-brand-300'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-5 py-2.5 rounded-xl border border-edge bg-white text-sm font-medium text-ink-muted hover:text-ink hover:border-brand-300 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
