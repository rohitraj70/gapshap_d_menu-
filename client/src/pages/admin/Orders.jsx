import { useEffect, useMemo, useState } from "react";
import { Check, X, Clock3, Phone, MapPin, User, UtensilsCrossed, Store, TableProperties } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { getOrders, updateOrderStatus } from "../../services/api";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-sky-100 text-sky-700",
  declined: "bg-rose-100 text-rose-700",
};

const OrderCard = ({ order, onStatusChange }) => {
  const statusLabel = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending";

  return (
    <div className="rounded-2xl border border-brown/10 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-3 border-b border-brown/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-brown-dark">{order.customerName}</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-brown-light">Order #{String(order._id).slice(-6)}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status] || statusStyles.pending}`}>
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 text-sm text-brown-light">
          <div className="flex items-center gap-2"><User size={14} /> {order.orderType === "outside" ? "Outside order" : "In-cafe order"}</div>
          {order.orderType === "outside" ? (
            <>
              <div className="flex items-center gap-2"><Phone size={14} /> {order.phone || "No phone provided"}</div>
              <div className="flex items-center gap-2"><MapPin size={14} /> {order.address || "No address provided"}</div>
            </>
          ) : (
            <div className="flex items-center gap-2"><TableProperties size={14} /> Table {order.tableNumber || "N/A"}</div>
          )}
        </div>

        <div className="space-y-2 text-sm text-brown-light">
          <div className="flex items-center gap-2"><Clock3 size={14} /> {new Date(order.createdAt).toLocaleString()}</div>
          <div className="flex items-center gap-2"><UtensilsCrossed size={14} /> {order.items.length} item(s)</div>
          <div className="flex items-center gap-2"><Store size={14} /> Total ₹{order.totalAmount}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-cream-dark p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brown-light">Items</p>
        <div className="space-y-2 text-sm text-brown-dark">
          {order.items.map((item, index) => (
            <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-white/80 px-2.5 py-2">
              <div>
                <div className="font-medium">{item.name}</div>
                {item.variantLabel && <div className="text-xs text-brown-light">{item.variantLabel}</div>}
              </div>
              <div className="text-right">
                <div className="font-semibold">{item.qty} × ₹{item.price}</div>
                <div className="text-xs text-brown-light">₹{item.qty * item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.notes && <p className="mt-4 text-sm text-brown-light">Note: {order.notes}</p>}

      {(order.status === "pending" || order.status === "confirmed") && (
        <div className="mt-4 flex flex-wrap gap-2">
          {order.status === "pending" && (
            <button
              onClick={() => onStatusChange(order._id, "confirmed")}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Check size={16} /> Confirm
            </button>
          )}
          {order.status === "confirmed" && (
            <button
              onClick={() => onStatusChange(order._id, "completed")}
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              <Check size={16} /> Mark completed
            </button>
          )}
          <button
            onClick={() => onStatusChange(order._id, "declined")}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <X size={16} /> Decline
          </button>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const pendingCount = useMemo(() => orders.filter((order) => order.status === "pending").length, [orders]);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, status: nextStatus } : order));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-brown-dark">Orders</h1>
            <p className="text-sm text-brown-light">Review new customer orders and confirm or decline them.</p>
          </div>
          <div className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
            {pendingCount} pending
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl skeleton animate-shimmer" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brown/20 bg-white/60 p-10 text-center text-brown-light">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
