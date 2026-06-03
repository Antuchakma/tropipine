import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/contact', form)
      setSuccess('Thank you! We received your message and will reply soon.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1649920209973-d2f09b3be005?q=80&w=1200&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-28 flex items-center justify-center min-h-screen">
          <div className="max-w-2xl space-y-8 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs uppercase tracking-widest text-grove font-semibold mb-3">Connect With Us</p>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-white mb-3">We&apos;d Love to Hear From You</h1>
              <p className="text-white/80 max-w-xl">Questions about orders, wholesale, or partnerships  send us a message.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 grid lg:grid-cols-3 gap-10">
        <div className="space-y-4">
          {[
            { icon: <FaPhone className="text-grove" />, title: 'Phone', val: '+880 1234-567890' },
            { icon: <FaEnvelope className="text-grove" />, title: 'Email', val: 'info@tropipine.com' },
            { icon: <FaMapMarkerAlt className="text-grove" />, title: 'Location', val: 'Dhaka, Bangladesh' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-stone rounded-3xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center shrink-0">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-bark">{item.title}</p>
                <p className="text-sm text-clay mt-0.5">{item.val}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-stone rounded-3xl p-8 space-y-5 shadow-card">
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">{error}</div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-clay mb-2">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-2xl border border-stone focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-clay mb-2">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-2xl border border-stone focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-clay mb-2">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-stone focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-clay mb-2">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-stone focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-clay mb-2">Message *</label>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 rounded-2xl border border-stone focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-grove text-white font-semibold  hover:opacity-90 disabled:opacity-50 transition">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
