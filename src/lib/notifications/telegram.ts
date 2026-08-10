/**
 * Telegram Notification Dispatcher
 *
 * Sends real-time notifications to a Telegram Bot / Channel using standard HTTP fetch.
 * Configured via environment variables:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 */

export interface TelegramNotificationPayload {
  title: string;
  message: string;
  url?: string;
}

export async function sendTelegramNotification(
  payload: TelegramNotificationPayload,
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Telegram is not configured, skip silently
    return false;
  }

  const text = `🔔 *${escapeMarkdownV2(payload.title)}*\n\n${escapeMarkdownV2(payload.message)}${
    payload.url ? `\n\n[Ver en el CRM](${payload.url})` : ''
  }`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: false,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      console.error('[Telegram Notification Error]', errData);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Telegram Notification Network Error]', err);
    return false;
  }
}

function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
