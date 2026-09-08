const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

export const notifyTelegramNewOrder = async (order) => {
  const { TELEGRAM_BOT_TOKEN: botToken, TELEGRAM_CHAT_ID: chatId } = process.env;

  if (!botToken || !chatId) return false;

  const adminOrdersUrl = `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/admin/orders`;
  const itemLines = order.items
    .map((item) => `• ${escapeHtml(item.name)} x${item.qty} - ₹${item.qty * item.price}`)
    .join("\n");
  const orderType = order.orderType === "outside" ? "Delivery" : `Table ${escapeHtml(order.tableNumber)}`;
  const contactDetails = order.orderType === "outside"
    ? `Phone: ${escapeHtml(order.phone)}\nAddress: ${escapeHtml(order.address)}`
    : orderType;
  const message = [
    "🔔 <b>New Gapshap Cafe Order</b>",
    `Customer: <b>${escapeHtml(order.customerName)}</b>`,
    `Type: ${orderType}`,
    contactDetails,
    "",
    itemLines,
    "",
    `<b>Total: ₹${order.totalAmount}</b>`,
    order.notes ? `Note: ${escapeHtml(order.notes)}` : "",
    `<a href="${escapeHtml(adminOrdersUrl)}">Open admin orders</a>`,
  ].filter(Boolean).join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });

    if (!response.ok) {
      console.error("Telegram notification failed:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram notification error:", error.message);
    return false;
  }
};
