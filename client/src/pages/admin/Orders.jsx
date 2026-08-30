import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Check, X, Clock3, Phone, MapPin, User, UtensilsCrossed, Store, TableProperties, BellRing } from "lucide-react";
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
  const [toast, setToast] = useState(null);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const audioContextRef = useRef(null);

  const playAlertTone = () => {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;

    const audioContext = audioContextRef.current || new AudioCtor();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.07, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.38);
  };

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

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, "") : "http://localhost:5001", {
      withCredentials: true,
    });

    socket.emit("admin:join");

    socket.on("new-order", (payload) => {
      const incomingOrder = payload?.order;
      if (!incomingOrder?._id) return;

      setOrders((prev) => {
        const exists = prev.some((order) => order._id === incomingOrder._id);
        if (exists) return prev;
        return [incomingOrder, ...prev];
      });

      setNewOrderCount((prev) => prev + 1);
      playAlertTone();

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New order received", {
          body: `${incomingOrder.customerName} placed a ${incomingOrder.orderType === "outside" ? "delivery" : "table"} order for ₹${incomingOrder.totalAmount}`,
          icon: "/Gapshap-logo.png",
        });
      }

      setToast({
        title: "New order received",
        message: `${incomingOrder.customerName} placed a ${incomingOrder.orderType === "outside" ? "delivery" : "table"} order for ₹${incomingOrder.totalAmount}`,
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const pendingCount = useMemo(() => orders.filter((order) => order.status === "pending").length, [orders]);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, status: nextStatus } : order));
      setNewOrderCount((prev) => (prev > 0 ? Math.max(0, prev - 1) : 0));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        {toast && (
          <div className="fixed right-4 top-20 z-50 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-500 p-2 text-white">
                <BellRing size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">{toast.title}</p>
                <p className="mt-1 text-sm text-amber-800">{toast.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-brown-dark">Orders</h1>
            <p className="text-sm text-brown-light">Review new customer orders and confirm or decline them.</p>
          </div>
          <button
            type="button"
            onClick={() => setNewOrderCount(0)}
            className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/15"
          >
            {newOrderCount > 0 ? `${newOrderCount} new` : `${pendingCount} pending`}
          </button>
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
