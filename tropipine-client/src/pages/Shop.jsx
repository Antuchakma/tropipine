import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import { usePageLoading } from '../context/LoadingContext'

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'popular', label: 'Best Sellers' },
]

const QUICK_FILTERS = [
  { label: 'All', key: null },
  { label: 'Exclusive', key: 'isExclusive' },
  { label: 'Best Sellers', key: 'isBestSeller' },
  { label: 'Featured', key: 'isFeatured' },
  { label: 'Seasonal', key: 'isSeasonal' },
  { label: 'In Stock', key: 'inStock' },
]

const LIMIT = 12

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const setDataLoading = usePageLoading()
  const isFirstFetch = useRef(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('')
  const [activeFilter, setActiveFilter] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [fruitTypes, setFruitTypes] = useState([])
  const [selectedFruitType, setSelectedFruitType] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (searchParams.get('isExclusive')) setActiveFilter('isExclusive')
  }, [])

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data || [])).catch(() => {})
    api.get('/products/fruit-types').then((r) => setFruitTypes(r.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    if (isFirstFetch.current) setDataLoading(true)
    const params = new URLSearchParams({ page, limit: LIMIT })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy) params.set('sortBy', sortBy)
    if (activeFilter) params.set(activeFilter, 'true')
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedFruitType) params.set('fruitType', selectedFruitType)
    api.get(`/products?${params}`)
      .then((r) => { setProducts(r.data.items || []); setTotal(r.data.total || 0) })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
        if (isFirstFetch.current) { setDataLoading(false); isFirstFetch.current = false }
      })
  }, [page, debouncedSearch, sortBy, activeFilter, selectedCategory, selectedFruitType])

  const totalPages = Math.ceil(total / LIMIT)
  const hasFilters = activeFilter || selectedCategory || selectedFruitType || debouncedSearch

  return (
    <div className="min-h-screen bg-cream">

      {/* Page header */}
      <div className="pt-28 pb-0 border-b border-stone">
        <div className="max-w-7xl mx-auto px-8 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 items-end pb-14"
          >
            <div>
              <p className="label text-grove mb-3">TropiPine / Shop</p>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-bark leading-none">
                {activeFilter === 'isExclusive'
                  ? <>Exclusive<br /><em>Varieties</em></>
                  : activeFilter === 'isBestSeller'
                  ? <>Best<br /><em>Sellers</em></>
                  : <>Fresh<br /><em>Tropical Fruits</em></>
                }
              </h1>
            </div>
            <div className="lg:pb-1">
              <p className="text-clay text-sm leading-relaxed max-w-sm">
                {activeFilter === 'isExclusive'
                  ? 'Limited-quantity varieties sourced from the finest orchards in Rajshahi. Available while stocks last.'
                  : 'Handpicked mangoes, lychees, pineapples and seasonal fruits — delivered fresh within 24 hours of harvest.'}
              </p>
              {total > 0 && (
                <p className="label text-clay/50 text-[10px] mt-4">{total} products available</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 sm:px-10 py-12">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay/50" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or variety"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-white border border-stone text-sm text-bark placeholder-clay/40 focus:outline-none focus:border-bark transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-clay/50 hover:text-bark">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="px-4 py-2.5 bg-white border border-stone text-sm text-clay focus:outline-none focus:border-bark transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 mb-10">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => { setActiveFilter(f.key); setPage(1) }}
              className={`px-4 py-1.5 text-xs tracking-wide border transition-colors ${
                activeFilter === f.key
                  ? 'bg-grove text-white border-grove font-semibold'
                  : 'bg-transparent text-clay border-stone hover:border-grove hover:text-grove'
              }`}
            >
              {f.label}
            </button>
          ))}
          {fruitTypes.map((item) => {
            const typeValue = typeof item === 'string' ? item : item.type
            return (
              <button
                key={typeValue}
                onClick={() => { setSelectedFruitType(selectedFruitType === typeValue ? '' : typeValue); setPage(1) }}
                className={`px-4 py-1.5 text-xs tracking-wide border transition-colors ${
                  selectedFruitType === typeValue
                    ? 'bg-grove text-white border-grove'
                    : 'bg-transparent text-clay border-stone hover:border-bark hover:text-bark'
                }`}
              >
                {typeValue}
              </button>
            )
          })}
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setPage(1) }}
              className={`px-4 py-1.5 text-xs tracking-wide border transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-earth text-white border-earth'
                  : 'bg-transparent text-clay border-stone hover:border-bark hover:text-bark'
              }`}
            >
              {cat.name}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setActiveFilter(null); setSelectedCategory(''); setSelectedFruitType(''); setSortBy('') }}
              className="px-4 py-1.5 text-xs text-clay/60 hover:text-bark underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4">
                  <div className="aspect-[4/5] bg-bone mb-4" />
                  <div className="h-3 bg-bone rounded w-1/3 mb-2" />
                  <div className="h-4 bg-bone rounded w-2/3 mb-2" />
                  <div className="h-3 bg-bone rounded w-1/2 mb-4" />
                  <div className="h-9 bg-bone rounded w-full" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              key={`${page}-${activeFilter}-${debouncedSearch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="h-full"
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
              className="text-center py-24 border border-stone"
            >
              <h3 className="font-display text-2xl font-semibold text-bark mb-2">No products found</h3>
              <p className="text-clay text-sm mb-6">Try adjusting your filters.</p>
              <button
                onClick={() => { setSearch(''); setActiveFilter(null); setSelectedCategory(''); setSelectedFruitType(''); setSortBy('') }}
                className="label text-bark border-b border-bark pb-0.5 hover:text-grove hover:border-grove transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-16">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-9 h-9 border border-stone text-clay text-sm hover:border-bark hover:text-bark disabled:opacity-30 transition-colors"
            >
              ←
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 text-sm font-medium transition-colors border ${
                  page === i + 1
                    ? 'bg-bark text-white border-bark'
                    : 'border-stone text-clay hover:border-bark hover:text-bark'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="w-9 h-9 border border-stone text-clay text-sm hover:border-bark hover:text-bark disabled:opacity-30 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* ─── BOTTOM PROMISE STRIP ─── */}
      <div className="border-t border-stone bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { title: 'Farm to Door', sub: 'Harvested within 24 hrs of your order' },
            { title: 'Free Delivery', sub: 'On all orders over ৳2,000 in Dhaka' },
            { title: 'Easy Returns', sub: 'Not satisfied? Full refund, no questions' },
          ].map((item) => (
            <div key={item.title} className="space-y-1">
              <p className="text-sm font-medium text-bark">{item.title}</p>
              <p className="text-xs text-clay/60">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
