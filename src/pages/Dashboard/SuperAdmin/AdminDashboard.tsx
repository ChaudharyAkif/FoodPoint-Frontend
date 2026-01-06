import { useState } from 'react';
import { Users, Plus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';

interface Cashier {
  name: string;
  email: string;
  password: string;
}

const AdminDashboard = () => {
  const [number, setNumber] = useState<number>(1);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const handleGenerateForms = () => {
    const tempCashiers: Cashier[] = [];
    for (let i = 0; i < number; i++) {
      const timestamp = Date.now() + i;
      tempCashiers.push({
        name: `Cashier ${timestamp}`,
        email: `cashier${timestamp}@example.com`,
        password: 'Cashier@123',
      });
    }
    setCashiers(tempCashiers);
  };

  const handleChange = (index: number, field: keyof Cashier, value: string) => {
    const updated = [...cashiers];
    updated[index][field] = value;
    setCashiers(updated);
  };

  const handleCreateCashiers = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axiosInstance.post(
        'auth/create-multiple-cashiers',
        { cashiers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        `${res.data.message} ${
          res.data.failedEmails.length ? `Failed: ${res.data.failedEmails.join(', ')}` : ''
        }`
      );
      setCashiers([]);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error creating cashiers');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/superadmin/cashiers')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Users size={18} />
              View All Cashiers
            </button>
            <button
              onClick={() => navigate('/dashboard/superadmin/profile')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Cashiers Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="text-orange-500" size={24} />
            Create New Cashiers
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Number of Cashiers:</label>
            <input
              type="number"
              min={1}
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateForms}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              Generate Forms
            </button>
          </div>

          {/* Dynamic Cashier Forms */}
          {cashiers.length > 0 && (
            <div className="space-y-4">
              {cashiers.map((cashier, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-gray-50 to-white"
                >
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    Cashier {index + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={cashier.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={cashier.email}
                      onChange={(e) => handleChange(index, 'email', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={cashier.password}
                      onChange={(e) => handleChange(index, 'password', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Password"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={handleCreateCashiers}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-md font-medium"
              >
                <Save size={20} />
                Create All Cashiers
              </button>
            </div>
          )}

          {message && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
