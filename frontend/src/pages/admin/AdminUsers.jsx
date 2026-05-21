import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import api from "../../api/axios";
import { TableRowSkeleton } from "../../components/common/LoadingSkeleton";
import Pagination from "../../components/common/Pagination";
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", { params: { page, limit: 20, search } });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Change role to "${newRole}"?`)) return;
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success("Role updated!");
      fetchUsers();
    } catch { toast.error("Failed to update role."); }
  };

  const toggleStatus = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !isActive });
      toast.success(isActive ? "User deactivated." : "User activated.");
      fetchUsers();
    } catch { toast.error("Failed to update status."); }
  };

  return (
    <>
      <Helmet><title>Manage Users — FarmSphere Admin</title></Helmet>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 text-sm">{pagination.total} registered users</p>
        </div>

        <div className="relative mb-5">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input pl-10"
          />
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {["User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRowSkeleton cols={7} rows={8} />
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-400">No users found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="px-4 py-3 text-gray-500">{user.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={user.role === "admin" ? "badge bg-purple-100 text-purple-700" : "badge bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={user.isActive ? "badge-green" : "badge-red"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString("en-NG")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => toggleRole(user._id, user.role)} className="text-xs text-blue-600 hover:underline font-medium">
                            {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                          </button>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => toggleStatus(user._id, user.isActive)} className={`text-xs font-medium ${user.isActive ? "text-red-500 hover:underline" : "text-green-600 hover:underline"}`}>
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
      </div>
    </>
  );
}
