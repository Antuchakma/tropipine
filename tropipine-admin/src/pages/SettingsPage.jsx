import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { btn, brandGrad, card, toastStyle } from '../utils/ui';
import { colors } from '../theme.js';

export default function SettingsPage() {
  const [mfs, setMfs] = useState({ bkash_number: '', nagad_number: '', rocket_number: '' });
  const [zones, setZones] = useState([]);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', charge: '', estimatedDays: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    Promise.all([
      api.get('/payments/config').catch(() => ({ data: { data: {} } })),
      api.get('/delivery').catch(() => ({ data: { data: [] } })),
    ]).then(([m, d]) => {
      setMfs(m.data.data || {});
      setZones(d.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveMfs = async () => {
    try {
      await api.patch('/payments/config', mfs);
      showToast('MFS numbers saved!');
    } catch { showToast('Failed to save', 'error'); }
  };

  const handleAddZone = async (e) => {
    e.preventDefault();
    if (!newZone.name || !newZone.charge || !newZone.estimatedDays) {
      showToast('Fill all zone fields', 'error'); return;
    }
    try {
      await api.post('/delivery', newZone);
      showToast('Delivery zone added!');
      setNewZone({ name: '', charge: '', estimatedDays: '' });
      setShowZoneForm(false);
      const r = await api.get('/delivery');
      setZones(r.data.data || []);
    } catch { showToast('Failed to add zone', 'error'); }
  };

  const handleDeleteZone = async (id) => {
    if (!window.confirm('Delete this zone?')) return;
    try {
      await api.delete(`/delivery/${id}`);
      showToast('Zone deleted');
      setZones((z) => z.filter((z) => z.id !== id));
    } catch { showToast('Failed', 'error'); }
  };

  const mfsFields = [
    { key: 'bkash_number',  label: 'bKash Merchant Number',   placeholder: '01XXXXXXXXX', color: colors.mfs.bkash  },
    { key: 'nagad_number',  label: 'Nagad Merchant Number',   placeholder: '01XXXXXXXXX', color: colors.mfs.nagad  },
    { key: 'rocket_number', label: 'Rocket Merchant Number',  placeholder: '01XXXXXXXXX', color: colors.mfs.rocket },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[900px] space-y-8">

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={toastStyle(toast.type)}>
            {toast.msg}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Settings</h2>
          <p className="text-sm text-ink-muted mt-0.5">Configure payments, delivery zones, and site options</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-ink-muted">Loading settings</div>
        ) : (
          <>
            {/* MFS */}
            <div className={`${card} p-7`}>
              <h3 className="font-bold text-ink text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>Mobile Financial Services</h3>
              <p className="text-sm text-ink-muted mb-6">Customers will send payments to these numbers</p>
              <div className="space-y-4">
                {mfsFields.map(({ key, label, placeholder, color }) => (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-ink-muted mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={mfs[key] || ''}
                        onChange={(e) => setMfs((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={handleSaveMfs} className={btn.primary} style={brandGrad}>
                  Save MFS Numbers
                </button>
              </div>
            </div>

            {/* Delivery Zones */}
            <div className={`${card} p-7`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-ink text-lg" style={{ fontFamily: 'var(--font-display)' }}>Delivery Zones</h3>
                  <p className="text-sm text-ink-muted mt-0.5">Configure delivery areas and charges</p>
                </div>
                <button onClick={() => setShowZoneForm(!showZoneForm)} className={btn.primary} style={brandGrad}>
                  + Add Zone
                </button>
              </div>

              {showZoneForm && (
                <form onSubmit={handleAddZone} className="bg-surface rounded-2xl p-5 mb-5 border border-edge">
                  <p className="text-sm font-semibold text-ink mb-4">New Delivery Zone</p>
                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-xs text-ink-muted mb-1.5">Zone Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Inside Dhaka"
                        value={newZone.name}
                        onChange={(e) => setNewZone((p) => ({ ...p, name: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink-muted mb-1.5">Charge ()</label>
                      <input
                        type="number"
                        placeholder="80"
                        value={newZone.charge}
                        onChange={(e) => setNewZone((p) => ({ ...p, charge: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink-muted mb-1.5">Estimated Days</label>
                      <input
                        type="text"
                        placeholder="1-2 days"
                        value={newZone.estimatedDays}
                        onChange={(e) => setNewZone((p) => ({ ...p, estimatedDays: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-edge bg-white text-sm focus:outline-none focus:border-brand-400 transition"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className={btn.primary} style={brandGrad}>Add Zone</button>
                    <button type="button" onClick={() => setShowZoneForm(false)} className={btn.secondary}>Cancel</button>
                  </div>
                </form>
              )}

              {zones.length === 0 ? (
                <div className="text-center py-10 text-sm text-ink-muted">No delivery zones configured yet.</div>
              ) : (
                <div className="space-y-3">
                  {zones.map((z) => (
                    <div key={z.id} className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface border border-edge">
                      <div>
                        <p className="font-semibold text-ink text-sm">{z.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{z.charge}  {z.estimatedDays}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteZone(z.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={`${card} p-7`}>
              <h3 className="font-bold text-ink text-lg mb-5" style={{ fontFamily: 'var(--font-display)' }}>Site Info</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Admin Email', val: 'admin@tropipine.com' },
                  { label: 'App Version', val: '1.0.0' },
                  { label: 'Environment', val: 'Production' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-surface rounded-xl p-4 border border-edge">
                    <p className="text-xs text-ink-muted mb-1">{label}</p>
                    <p className="text-sm font-semibold text-ink">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
