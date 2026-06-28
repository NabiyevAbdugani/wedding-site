export async function POST(request) {
  const { text } = await request.json();

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  const response = await fetch(
    https://api.telegram.org/bot${token}/sendMessage,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text }),
    }
  );

  if (!response.ok) {
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
}
