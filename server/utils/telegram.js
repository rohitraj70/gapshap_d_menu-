const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const splitEnvValues = (value) => {
  if (!value) return [];
  return String(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const getTelegramTargets = () => {
  const numberedTokenEntries = Object.entries(process.env)
    .filter(([key]) => /^TELEGRAM_BOT_TOKEN(?:_\d+)?$/i.test(key));
  const numberedChatEntries = Object.entries(process.env)
    .filter(([key]) => /^TELEGRAM_CHAT_ID(?:_\d+)?$/i.test(key));

  const tokenMap = new Map();
  const chatMap = new Map();

  for (const [key, value] of numberedTokenEntries) {
    const match = key.match(/^TELEGRAM_BOT_TOKEN(?:_(\d+))?$/i);
    const index = Number(match?.[1] || 0);
    tokenMap.set(index, [...(tokenMap.get(index) || []), ...splitEnvValues(value)]);
  }

  for (const [key, value] of numberedChatEntries) {
    const match = key.match(/^TELEGRAM_CHAT_ID(?:_(\d+))?$/i);
    const index = Number(match?.[1] || 0);
    chatMap.set(index, [...(chatMap.get(index) || []), ...splitEnvValues(value)]);
  }

  const legacyTokens = splitEnvValues(process.env.TELEGRAM_BOT_TOKENS || process.env.TELEGRAM_BOT_TOKEN);
  const legacyChatIds = splitEnvValues(process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID);

  const targets = [];
  const maxIndex = Math.max(
    ...(Array.from(tokenMap.keys()).concat(Array.from(chatMap.keys())).concat([0])),
  );

  for (let index = 0; index <= maxIndex; index += 1) {
    const tokenCandidates = tokenMap.get(index) || [];
    const chatCandidates = chatMap.get(index) || [];

    if (tokenCandidates.length === 0 && chatCandidates.length === 0) continue;

    const token = tokenCandidates[0] || null;
    const chatId = chatCandidates[0] || null;

    if (token && chatId) {
      targets.push({ token, chatId });
    }
  }

  const pairCount = Math.max(legacyTokens.length, legacyChatIds.length);
  for (let index = 0; index < pairCount; index += 1) {
    const token = legacyTokens[index] || (legacyTokens.length === 1 ? legacyTokens[0] : null);
    const chatId = legacyChatIds[index] || (legacyChatIds.length === 1 ? legacyChatIds[0] : null);

    if (token && chatId) {
      targets.push({ token, chatId });
    }
  }

  return targets.filter(
    (target, index, list) => list.findIndex((candidate) => candidate.token === target.token && candidate.chatId === target.chatId) === index,
  );
};

export const notifyTelegramNewOrder = async (order) => {
  const targets = getTelegramTargets();

  if (targets.length === 0) return false;

  const adminOrdersUrl = `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/admin/orders`;
  const itemLines = order.items
    .map((item) => `• ${escapeHtml(item.name)} x${item.qty} - ₹${item.qty * item.price}`)
    .join("\n");
  const orderType = order.orderType === "outside" ? "Delivery" : `Table ${escapeHtml(order.tableNumber)}`;
  const contactDetails = order.orderType === "outside"
    ? `Phone: ${escapeHtml(order.phone)}\nAddress: ${escapeHtml(order.address)}`
    : orderType;
  const message = [
    "🔔 <b>New Gapshup Cafe Order</b>",
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

  let sentCount = 0;

  for (const { token, chatId } of targets) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      });

      if (!response.ok) {
        console.error("Telegram notification failed for chat:", chatId, await response.text());
        continue;
      }

      sentCount += 1;
    } catch (error) {
      console.error("Telegram notification error for chat:", chatId, error.message);
    }
  }

  return sentCount > 0;
};
