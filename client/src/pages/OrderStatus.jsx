import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3, XCircle, ArrowLeft } from "lucide-react";
import { getOrderById } from "../services/api";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-100 text-amber-700",
    note: "Your order has been received and is waiting for confirmation from the kitchen.",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700",
    note: "Your order is confirmed. Please wait for delivery, and pay when it reaches you.",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-sky-100 text-sky-700",
    note: "This order has been completed. It will remain in your history for a short time before being cleared.",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    className: "bg-rose-100 text-rose-700",
    note: "This order was declined by the cafe. If you want to update it, please contact the restaurant.",
  },
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

const OrderStatus = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const orderId = searchParams.get("id");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await getOrderById(orderId);
        const serverOrder = res.data.data;
        const nextHistory = mergeCustomerOrders([serverOrder]);
        localStorage.setItem("gapshap_customer_orders", JSON.stringify(nextHistory));
        setOrder(serverOrder);
      } catch (error) {
        console.error(error);
        const localOrders = JSON.parse(localStorage.getItem("gapshap_customer_orders") || "[]");
        const localMatch = localOrders.find((entry) => entry._id === orderId);
        if (localMatch) {
          setOrder(localMatch);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-card text-center">
          <h1 className="font-display text-2xl font-bold text-brown-dark">No order found</h1>
          <p className="mt-2 text-sm text-brown-light">Use the order link sent after checkout to track your order status.</p>
          <button onClick={() => navigate("/")} className="mt-4 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white">Go home</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-card">
          <div className="h-8 w-40 rounded-full skeleton animate-shimmer" />
          <div className="mt-4 h-20 rounded-2xl skeleton animate-shimmer" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-card text-center">
          <h1 className="font-display text-2xl font-bold text-brown-dark">Order not found</h1>
          <p className="mt-2 text-sm text-brown-light">This order may have been removed or the link is invalid.</p>
          <button onClick={() => navigate("/")} className="mt-4 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white">Back to menu</button>
        </div>
      </div>
    );
  }

  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brown-dark">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${config.className}`}>
            <StatusIcon size={16} /> {config.label}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-brown-dark">Order status</h1>
          <p className="mt-2 text-sm text-brown-light">{config.note}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/order-history")}
              className="rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/15"
            >
              View order history
            </button>
            {order.status === "completed" || order.status === "declined" ? (
              <button
                onClick={() => navigate("/")}
                className="rounded-full border border-brown/10 bg-white px-3 py-2 text-sm font-semibold text-brown-dark hover:bg-cream"
              >
                Back to menu
              </button>
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl bg-cream-dark p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brown-light">Delivery details</p>
            <div className="mt-3 space-y-2 text-sm text-brown-dark">
              <div><span className="font-semibold">Name:</span> {order.customerName}</div>
              {order.orderType === "outside" ? (
                <>
                  <div><span className="font-semibold">Phone:</span> {order.phone}</div>
                  <div><span className="font-semibold">Address:</span> {order.address}</div>
                </>
              ) : (
                <div><span className="font-semibold">Table:</span> {order.tableNumber}</div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {order.items.map((item, index) => (
              <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-brown/10 bg-cream px-3 py-2 text-sm text-brown-dark">
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.variantLabel && <div className="text-xs text-brown-light">{item.variantLabel}</div>}
                </div>
                <div className="text-right">
                  <div>{item.qty} × ₹{item.price}</div>
                  <div className="text-xs text-brown-light">₹{item.qty * item.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-brown/10 pt-4">
            <span className="text-sm text-brown-light">Total</span>
            <span className="font-display text-2xl font-bold text-brown-dark">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
