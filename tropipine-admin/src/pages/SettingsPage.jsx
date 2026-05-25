import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

export default function SettingsPage() {
  const [mfsSettings, setMfsSettings] = useState({
    bkash_number: '',
    nagad_number: '',
    rocket_number: '',
  });
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [newZone, setNewZone] = useState({
    name: '',
    charge: '',
    estimatedDays: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [mfsRes, deliveryRes] = await Promise.all([
        api.get('/payments/config').catch(() => ({ data: { data: {} } })),
        api.get('/delivery').catch(() => ({ data: { data: [] } })),
      ]);

      setMfsSettings(mfsRes.data.data || {});
      setDeliveryZones(deliveryRes.data.data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleMfsChange = (e) => {
    const { name, value } = e.target;
    setMfsSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveMfs = async () => {
    try {
      await api.patch('/payments/config', mfsSettings);
      setSuccess('MFS settings saved successfully!');
    } catch (error) {
      setError('Failed to save MFS settings');
    }
  };

  const handleAddDeliveryZone = async (e) => {
    e.preventDefault();
    if (!newZone.name || !newZone.charge || !newZone.estimatedDays) {
      setError('Please fill all fields');
      return;
    }

    try {
      await api.post('/delivery', newZone);
      setSuccess('Delivery zone added!');
      setNewZone({ name: '', charge: '', estimatedDays: '' });
      setShowDeliveryForm(false);
      fetchSettings();
    } catch (error) {
      setError('Failed to add delivery zone');
    }
  };

  const handleDeleteDeliveryZone = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/delivery/${id}`);
        setSuccess('Delivery zone deleted!');
        fetchSettings();
      } catch (error) {
        setError('Failed to delete delivery zone');
      }
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {/* MFS Settings */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Mobile Financial Service (MFS) Configuration</h3>
              <p className="text-gray-600 text-sm mb-6">Enter the merchant numbers where customers will send payment</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">bKash Number</label>
                  <input
                    type="text"
                    name="bkash_number"
                    value={mfsSettings.bkash_number || ''}
                    onChange={handleMfsChange}
                    placeholder="e.g., 01XXXXXXXXX"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Nagad Number</label>
                  <input
                    type="text"
                    name="nagad_number"
                    value={mfsSettings.nagad_number || ''}
                    onChange={handleMfsChange}
                    placeholder="e.g., 01XXXXXXXXX"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Rocket Number</label>
                  <input
                    type="text"
                    name="rocket_number"
                    value={mfsSettings.rocket_number || ''}
                    onChange={handleMfsChange}
                    placeholder="e.g., 01XXXXXXXXX"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <button
                  onClick={handleSaveMfs}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FaSave /> Save MFS Settings
                </button>
              </div>
            </div>

            {/* Delivery Zones */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Delivery Zones</h3>
                <button
                  onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <FaPlus /> Add Zone
                </button>
              </div>

              {/* Add Zone Form */}
              {showDeliveryForm && (
                <form onSubmit={handleAddDeliveryZone} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Zone Name (e.g., Inside Dhaka)"
                      value={newZone.name}
                      onChange={(e) => setNewZone((prev) => ({ ...prev, name: e.target.value }))}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Delivery Charge (৳)"
                      value={newZone.charge}
                      onChange={(e) => setNewZone((prev) => ({ ...prev, charge: e.target.value }))}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Estimated Days (e.g., 1-2 days)"
                      value={newZone.estimatedDays}
                      onChange={(e) => setNewZone((prev) => ({ ...prev, estimatedDays: e.target.value }))}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
                    >
                      Add Zone
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeliveryForm(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Zones List */}
              {deliveryZones.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No delivery zones configured</p>
              ) : (
                <div className="space-y-4">
                  {deliveryZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{zone.name}</p>
                        <p className="text-sm text-gray-600">
                          Charge: ৳{zone.charge} • Estimated: {zone.estimatedDays}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteDeliveryZone(zone.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Site Info */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Site Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <p className="text-gray-600 text-sm mb-2">Admin Email</p>
                  <p className="font-bold text-lg">admin@tropipine.com</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <p className="text-gray-600 text-sm mb-2">Version</p>
                  <p className="font-bold text-lg">1.0.0</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
