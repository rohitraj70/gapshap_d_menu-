import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, MessageSquareText, MapPin, Phone, UserRound, TableProperties } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { createOrder } from "../services/api";

const ORDER_TYPES = {
  outside: "Outside the cafe",
  in_cafe: "I am in the cafe",
};

const OrderCheckout = () => {
  const navigate = useNavigate();
  const { orders, totalAmount, clearOrders } = useFavorites();

  const [orderType, setOrderType] = useState("outside");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const cartItems = useMemo(
    () => orders.map((item) => ({
      menuItemId: item.menuItemId || item._id,
      name: item.name,
      variantLabel: item.variantLabel || "",
      qty: item.qty,
      price: item.price,
    })),
    [orders]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (orderType === "outside" && (!phone.trim() || !address.trim())) {
      setMessage("Please add your phone number and address for delivery orders.");
      return;
    }

    if (orderType === "in_cafe" && !tableNumber.trim()) {
      setMessage("Please enter the table number shown on your table QR code.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        customerName,
        phone,
        address,
        tableNumber,
        orderType,
        notes,
        items: cartItems,
      };

      const response = await createOrder(payload);
      const newOrder = response.data.data;
      localStorage.setItem("gapshap_latest_order_id", newOrder._id);
      clearOrders();
      setMessage("Order placed successfully. Please wait for the admin to confirm it.");
      setTimeout(() => navigate(`/order-status?id=${newOrder._id}`), 1200);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Something went wrong while placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream px-4 py-6">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-card">
          <h1 className="font-display text-2xl font-bold text-brown-dark">Your order is empty</h1>
          <p className="mt-2 text-sm text-brown-light">Add items from the menu before placing an order.</p>
          <button onClick={() => navigate("/")} className="mt-4 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white">Browse menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-10">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brown-dark">
          <ArrowLeft size={18} /> Back to My Orders
        </button>

        <div className="rounded-3xl bg-white p-4 shadow-card sm:p-6">
          <h1 className="font-display text-3xl font-bold text-brown-dark">Place your order</h1>
          <p className="mt-1 text-sm text-brown-light">Choose how you are ordering and share the details we need.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-brown-dark">How are you ordering?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(ORDER_TYPES).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOrderType(value)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      orderType === value
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-brown/10 bg-cream-dark text-brown-dark"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-brown-dark">
                <span className="inline-flex items-center gap-2 font-medium"><UserRound size={15} /> Name</span>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-xl border border-brown/10 bg-cream px-3 py-2.5 outline-none ring-0 focus:border-accent" placeholder="Your name" />
              </label>

              {orderType === "outside" ? (
                <label className="space-y-2 text-sm text-brown-dark">
                  <span className="inline-flex items-center gap-2 font-medium"><Phone size={15} /> Phone number</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-brown/10 bg-cream px-3 py-2.5 outline-none ring-0 focus:border-accent" placeholder="e.g. 9876543210" />
                </label>
              ) : (
                <label className="space-y-2 text-sm text-brown-dark">
                  <span className="inline-flex items-center gap-2 font-medium"><TableProperties size={15} /> Table number</span>
                  <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full rounded-xl border border-brown/10 bg-cream px-3 py-2.5 outline-none ring-0 focus:border-accent" placeholder="e.g. T-07" />
                </label>
              )}
            </div>

            {orderType === "outside" && (
              <label className="block space-y-2 text-sm text-brown-dark">
                <span className="inline-flex items-center gap-2 font-medium"><MapPin size={15} /> Delivery address</span>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full rounded-xl border border-brown/10 bg-cream px-3 py-2.5 outline-none ring-0 focus:border-accent" placeholder="Street, area, landmark, city" />
              </label>
            )}

            {orderType === "in_cafe" && (
              <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
                Please enter the table number printed on the QR code at your table.
              </div>
            )}

            <label className="block space-y-2 text-sm text-brown-dark">
              <span className="inline-flex items-center gap-2 font-medium"><MessageSquareText size={15} /> Order note (optional)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-brown/10 bg-cream px-3 py-2.5 outline-none ring-0 focus:border-accent" placeholder="Any special request?" />
            </label>

            <div className="rounded-2xl bg-cream-dark p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-brown-light">Your order</p>
              <div className="mt-3 space-y-2">
                {orders.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-3 text-sm text-brown-dark">
                    <span>{item.name} {item.variantLabel ? `(${item.variantLabel})` : ""} × {item.qty}</span>
                    <span className="font-semibold">₹{item.qty * item.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-brown/10 pt-3">
                <span className="font-semibold text-brown-dark">Estimated total</span>
                <span className="font-display text-2xl font-bold text-brown-dark">₹{totalAmount}</span>
              </div>
            </div>

            {message && (
              <div className={`rounded-xl border px-3 py-2 text-sm ${message.includes("success") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-accent px-4 py-3.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
