import { useEffect, useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { getCashiersApi, deleteCashierApi } from "../../../api/auth.api";
import { Users, Edit2, Trash2, Plus, Search, ArrowLeft } from "lucide-react";

// Define the Cashier interface
interface Cashier {
  _id: string;
  name: string;
  email: string;
}

// Define props interface for CashierRow
interface CashierRowProps {
  cashier: Cashier;
  idx: number;
  onEdit: (id: string) => void | Promise<void>;
  onDelete: (cashier: Cashier) => void;
}

// Memoized Row Component
const CashierRow = memo<CashierRowProps>(({ cashier, idx, onEdit, onDelete }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="px-6 py-4">{idx + 1}</td>
    <td className="px-6 py-4">{cashier.name}</td>
    <td className="px-6 py-4">{cashier.email}</td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(cashier._id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(cashier)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </td>
  </tr>
));

const Cashiers = () => {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const navigate = useNavigate();

  // Fetch cashiers
  const fetchCashiers = async () => {
    try {
      setLoading(true);
      const res = await getCashiersApi();
      const cashiersArray = Object.keys(res.data)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => res.data[key]);
      setCashiers(cashiersArray);
    } catch (error) {
      console.error("Error fetching cashiers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashiers();
  }, []);

  // Memoized filtered cashiers for high-speed search
  const filteredCashiers = useMemo(() => {
    return cashiers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cashiers, searchQuery]);

  // Delete cashier
  const confirmDelete = async () => {
    if (!selectedCashier) return;
    
    try {
      await deleteCashierApi(selectedCashier._id);
      setShowDeleteModal(false);
      setSelectedCashier(null);
      fetchCashiers();
    } catch {
      alert("Error deleting cashier");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-orange-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">All Cashiers</h1>
          </div>
          <p className="text-gray-600">Manage your cashier accounts</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={() => navigate("/dashboard/superadmin/cashiers/add")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Cashier
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton loader for fast UX
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-32"></div></td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {filteredCashiers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No Cashiers Found
                      </td>
                    </tr>
                  ) : (
                    filteredCashiers.map((c, idx) => (
                      <CashierRow
                        key={c._id}
                        cashier={c}
                        idx={idx}
                        onEdit={(id: string) => navigate(`/dashboard/superadmin/cashiers/edit/${id}`)}
                        onDelete={(cashier: Cashier) => {
                          setSelectedCashier(cashier);
                          setShowDeleteModal(true);
                        }}
                      />
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => navigate("/dashboard/superadmin/details")}
          className="mt-6 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCashier?.name}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cashiers;