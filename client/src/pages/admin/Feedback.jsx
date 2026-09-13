import { useEffect, useState } from "react";
import { MessageSquareText, User, Clock3, ShoppingBag } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { getFeedback } from "../../services/api";

const Feedback = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await getFeedback();
        setFeedbackItems(response.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-brown-dark">Feedback</h1>
          <p className="text-sm text-brown-light">Customer comments and suggestions sent from the order status page.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-36 rounded-2xl skeleton animate-shimmer" />
            ))}
          </div>
        ) : feedbackItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brown/20 bg-white/60 p-10 text-center text-brown-light">
            No customer feedback yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackItems.map((item) => (
              <div key={item._id} className="rounded-2xl border border-brown/10 bg-white p-4 shadow-card">
                <div className="flex flex-col gap-3 border-b border-brown/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-brown-dark">
                    <User size={16} />
                    <span className="font-semibold">{item.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-brown-light">
                    <Clock3 size={14} />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>

                {item.orderId && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    <ShoppingBag size={14} /> Order #{String(item.orderId).slice(-6)}
                  </div>
                )}

                <div className="mt-4 rounded-2xl bg-[#f8efe6] p-3 text-sm text-brown-dark ring-1 ring-[#ead7c0] dark:bg-[#2a211d] dark:text-[#fff8f0] dark:ring-[#5d4336]">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f4e37] dark:text-[#f0c28c]">
                    <MessageSquareText size={14} /> Feedback
                  </div>
                  <p className="leading-6">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feedback;
