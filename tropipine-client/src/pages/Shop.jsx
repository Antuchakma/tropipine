import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import { FaSearch } from 'react-icons/fa'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          page,
          limit: 12,
          ...(search && { search }),
        })
        const response = await api.get(`/products?${params}`)
        setProducts(response.data.items || [])
        setTotal(response.data.total || 0)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [page, search])

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4">Shop Our Collection</h1>
          <p className="text-lg text-[#6A625B]">Browse our selection of premium tropical fruits</p>
        </motion.div>
        
        {/* Search Bar */}
        <div className="mb-10 flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search fruits..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full px-5 py-3 rounded-2xl border border-[#E7DBCF] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
            />
            <FaSearch className="absolute right-4 top-4 text-[#8B5E3C]" />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B5E3C] border-t-transparent"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 bg-[#8B5E3C] text-white rounded-2xl hover:bg-[#7a4e2f] disabled:opacity-50 transition font-semibold"
                >
                  Previous
                </button>
                <span className="px-6 py-3 text-[#5A5149] font-medium">
                  Page {page} of {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 12 >= total}
                  className="px-6 py-3 bg-[#8B5E3C] text-white rounded-2xl hover:bg-[#7a4e2f] disabled:opacity-50 transition font-semibold"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[#6A625B]">No products found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
