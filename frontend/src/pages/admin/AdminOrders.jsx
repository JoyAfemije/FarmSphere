import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { orderAPI } from "../../api/orders";
import { formatNaira } from "../../utils/formatCurrency";
import { TableRowSkeleton } from "../../components/common/LoadingSkeleton";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending","confirmed","processing","shipped","delivered","cancelled"];
const PAYMENT_OPTIONS = ["pending","paid","failed","refunded"];

const STATUS_COLORS = {
  pending: "badge-yellow", confirmed: "badge bg-blue-100 text-blue-700",
  processing: "badge bg-purple-100 text-purple-700", shipped: "badge bg-cyan-100 text-cyan-700",
  delivered: "badge-green", cancelled: "badge-red",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await orderAPI.getAll(params);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, orderStatus) => {
    setUpdating(orderId);
    try {
      await orderAPI.updateStatus(orderId, { orderStatus });
      toast.success("Order status updated!");
      fetchOrders();
    } catch { toast.error("Update failed."); }
    finally { setUpdating(null); }
  };

  return (
    <>
      <Helmet><title>Manage Orders — FarmSphere Admin</title></Helmet>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Orders</h1>
            <p className="text-gray-500 text-sm">{pagination.total} orders total</p>
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRowSkeleton cols={8} rows={8} />
                ) : orders.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-gray-400">No orders found.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-primary-600 font-medium whitespace-nowrap">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 dark:text-white">{order.user?.name || order.shippingAddress?.fullName || "Guest"}</p>
                        <p className="text-xs text-gray-400">{order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} item(s)</td>
                      <td className="px-4 py-3 font-bold text-primary-600">{formatNaira(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={order.paymentStatus === "paid" ? "badge-green" : order.paymentStatus === "failed" ? "badge-red" : "badge-yellow"}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className={`text-xs font-semibold rounded-lg px-2 py-1 border-0 cursor-pointer ${
                            order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                            order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                            order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-NG")}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/admin/orders/${order._id}`} className="text-xs text-primary-600 hover:underline font-medium">View</a>
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
