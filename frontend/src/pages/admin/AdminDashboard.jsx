import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiShoppingBag, FiUsers, FiDollarSign, FiTruck, FiPackage, FiClock } from "react-icons/fi";
import { orderAPI } from "../../api/orders";
import { productAPI } from "../../api/products";
import { formatNaira } from "../../utils/formatCurrency";

function StatCard({ icon, label, value, sub, color, loading }) {
  return (
    <div className={`card p-6 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          {loading ? (
            <div className="skeleton h-8 w-28 rounded mt-2" />
          ) : (
            <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          )}
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace("border-l-", "bg-").replace("-600", "-100 dark:bg-")}-900/20 text-current`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  pending: "badge-yellow",
  confirmed: "badge bg-blue-100 text-blue-700",
  processing: "badge bg-purple-100 text-purple-700",
  shipped: "badge bg-cyan-100 text-cyan-700",
  delivered: "badge-green",
  cancelled: "badge-red",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          orderAPI.getStats(),
          orderAPI.getAll({ page: 1, limit: 5 }),
        ]);
        setStats(statsRes.data.stats);
        setRecentOrders(ordersRes.data.orders);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { icon: <FiDollarSign size={22} className="text-green-600" />, label: "Total Revenue", value: formatNaira(stats?.totalRevenue || 0), color: "border-l-green-600", sub: "From paid orders" },
    { icon: <FiShoppingBag size={22} className="text-blue-600" />, label: "Total Orders", value: stats?.totalOrders?.toLocaleString() || "0", color: "border-l-blue-600", sub: "All time" },
    { icon: <FiClock size={22} className="text-yellow-600" />, label: "Pending Orders", value: stats?.pendingOrders?.toLocaleString() || "0", color: "border-l-yellow-600", sub: "Needs attention" },
    { icon: <FiTruck size={22} className="text-purple-600" />, label: "Delivered", value: stats?.deliveredOrders?.toLocaleString() || "0", color: "border-l-purple-600", sub: "Successfully completed" },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — FarmSphere</title></Helmet>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin! Here's what's happening at FarmSphere.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <StatCard {...card} loading={loading} />
            </motion.div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-primary-600 hover:underline font-medium">View All →</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Order #</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="py-3 pr-4"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No orders yet.</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-primary-600 font-medium">{order.orderNumber}</td>
                      <td className="py-3 pr-4 font-medium">{order.user?.name || order.shippingAddress?.fullName || "Guest"}</td>
                      <td className="py-3 pr-4 font-semibold text-primary-600">{formatNaira(order.total)}</td>
                      <td className="py-3 pr-4">
                        <span className={STATUS_COLORS[order.orderStatus] || "badge"}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString("en-NG")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
