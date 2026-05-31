import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'false' },
  { label: 'Approved', value: 'true' },
];

function StarRow({ rating }) {
  return (
    <span className="flex gap-0.5 text-base">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-amber-400' : 'text-gray-300'}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);

  const limit = 20;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (tab !== '') params.set('isApproved', tab);
      const res = await api.get(`/reviews?${params}`);
      setReviews(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleTabChange = (value) => {
    setTab(value);
    setPage(1);
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/reviews/${id}/approve`);
      showToast('Review approved');
      fetchReviews();
    } catch {
      showToast('Failed to approve review', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setActionId(id);
    try {
      await api.delete(`/reviews/${id}`);
      showToast('Review deleted');
      fetchReviews();
    } catch {
      showToast('Failed to delete review', 'error');
    } finally {
      setActionId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Reviews</h1>
            <p className="text-sm text-ink-light mt-0.5">{total} total review{total !== 1 ? 's' : ''}</p>
          </div>
          {pendingCount > 0 && tab === '' && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-semibold text-amber-700">{pendingCount} pending approval</span>
            </div>
          )}
        </div>

        {/* Table card */}
        <div className="bg-white border border-edge rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-edge">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTabChange(t.value)}
                className={`px-6 py-3.5 text-sm font-medium transition-colors ${
                  tab === t.value
                    ? 'text-brand-500 border-b-2 border-brand-500 -mb-px bg-orange-50/50'
                    : 'text-ink-light hover:text-ink hover:bg-surface-alt'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-16 bg-surface-alt rounded-xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-ink-light font-medium">No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-white">
                    {['Product', 'Reviewer', 'Rating', 'Comment', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-xs font-semibold text-ink-light uppercase tracking-wider px-5 py-3.5 text-left border-b border-edge">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-surface-alt hover:bg-surface-white transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-ink max-w-[140px] truncate">
                          {review.product?.name || '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-ink">{review.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-ink-light truncate max-w-[120px]">{review.user?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StarRow rating={review.rating} />
                        <span className="text-xs text-ink-light mt-0.5 block">{review.rating}/5</span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        {review.comment ? (
                          <p className="text-sm text-ink-dim line-clamp-2">{review.comment}</p>
                        ) : (
                          <span className="text-xs text-ink-extra italic">No comment</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-ink-light">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {review.isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {!review.isApproved && (
                            <button
                              onClick={() => handleApprove(review.id)}
                              disabled={actionId === review.id}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(review.id)}
                            disabled={actionId === review.id}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-200 disabled:opacity-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-light">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-edge rounded-xl text-sm font-medium text-ink-dim hover:bg-surface-alt disabled:opacity-40 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-edge rounded-xl text-sm font-medium text-ink-dim hover:bg-surface-alt disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
