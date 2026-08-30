import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, PhoneCall, XCircle, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusMap = {
  pending: { label: "Pending", icon: Clock3, className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
  completed: { label: "Completed", icon: PackageCheck, className: "bg-sky-100 text-sky-700" },
  declined: { label: "Declined", icon: XCircle, className: "bg-rose-100 text-rose-700" },
};

const ORDER_HISTORY_TTL_MS = 4 * 60 * 60 * 1000;

const shouldKeepOrderHistory = (order) => {
  if (!order || !order._id || !order.createdAt) return false;
  if (!["completed", "declined"].includes(order.status)) return true;
  const ageMs = Date.now() - new Date(order.createdAt).getTime();
  return ageMs <= ORDER_HISTORY_TTL_MS;
};

const mergeCustomerOrders = (incoming = []) => {
  const stored = JSON.parse(localStorage.getItem("gapshap_customer_orders") || "[]");
  const merged = new Map();

  [...stored, ...incoming].forEach((entry) => {
    if (!entry || !entry._id) return;
    const previous = merged.get(entry._id) || {};
    merged.set(entry._id, { ...previous, ...entry });
  });

  return [...merged.values()]
    .filter(shouldKeepOrderHistory)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = () => {
      try {
        const raw = localStorage.getItem("gapshap_customer_orders");
        const list = raw ? mergeCustomerOrders(JSON.parse(raw)) : [];
        localStorage.setItem("gapshap_customer_orders", JSON.stringify(list));
        setOrders(list);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const saveOrders = (nextList) => {
    const deduped = mergeCustomerOrders(nextList);
    localStorage.setItem("gapshap_customer_orders", JSON.stringify(deduped));
    setOrders(deduped);
  };

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("gapshap_customer_orders");
      if (!stored) return;
      try {
        const parsed = mergeCustomerOrders(JSON.parse(stored));
        localStorage.setItem("gapshap_customer_orders", JSON.stringify(parsed));
        setOrders(parsed);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleCall = (phone) => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream p-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-card">
          <div className="h-8 w-36 rounded-full skeleton animate-shimmer" />
          <div className="mt-4 space-y-3">
            <div className="h-20 rounded-2xl skeleton animate-shimmer" />
            <div className="h-20 rounded-2xl skeleton animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-8">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brown-dark">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-brown-dark">Order history</h1>
            <p className="text-sm text-brown-light">Your recent orders stay here so you can track the latest updates.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brown/20 bg-white/80 p-8 text-center text-brown-light">
            No orders yet. Place your first order from the menu.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const config = statusMap[order.status] || statusMap.pending;
              const StatusIcon = config.icon;

              return (
                <div key={order._id} className="rounded-2xl bg-white p-3 shadow-card">
                  <div className="flex flex-col gap-2 border-b border-brown/10 pb-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-brown-light">Order ID</p>
                      <p className="font-display text-lg font-bold text-brown-dark">#{String(order._id).slice(-6)}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
                      <StatusIcon size={14} /> {config.label}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-brown-light sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <div><span className="font-semibold text-brown-dark">Name:</span> {order.customerName}</div>
                      {order.orderType === "outside" ? (
                        <>
                          <div><span className="font-semibold text-brown-dark">Phone:</span> {order.phone}</div>
                          <div><span className="font-semibold text-brown-dark">Address:</span> {order.address}</div>
                        </>
                      ) : (
                        <div><span className="font-semibold text-brown-dark">Table:</span> {order.tableNumber}</div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <div><span className="font-semibold text-brown-dark">Type:</span> {order.orderType === "outside" ? "Outside cafe" : "In cafe"}</div>
                      <div><span className="font-semibold text-brown-dark">Created:</span> {new Date(order.createdAt).toLocaleString()}</div>
                      <div><span className="font-semibold text-brown-dark">Total:</span> ₹{order.totalAmount}</div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-cream-dark p-2.5">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brown-light">Items</p>
                    <div className="space-y-1.5 text-xs text-brown-dark">
                      {order.items.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-white px-2 py-1.5">
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{item.name}</div>
                            {item.variantLabel && <div className="truncate text-[10px] text-brown-light">{item.variantLabel}</div>}
                          </div>
                          <div className="text-right text-[11px]">
                            <div>{item.qty} × ₹{item.price}</div>
                            <div className="text-brown-light">₹{item.qty * item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.orderType === "outside" && order.phone && order.status !== "declined" && order.status !== "completed" && (
                    <button
                      onClick={() => handleCall(order.phone)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brown-dark px-3 py-1.5 text-xs font-semibold text-white hover:bg-brown"
                    >
                      <PhoneCall size={14} /> Call customer
                    </button>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/order-status?id=${order._id}`)}
                      className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent/15"
                    >
                      View status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
