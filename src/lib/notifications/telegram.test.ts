import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { sendTelegramNotification } from './telegram';

describe('sendTelegramNotification', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('skips sending and returns false when env vars are missing', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;

    const result = await sendTelegramNotification({
      title: 'Test',
      message: 'Hello',
    });

    expect(result).toBe(false);
  });

  it('sends POST request to Telegram API when env vars are set', async () => {
    process.env.TELEGRAM_BOT_TOKEN = '123456:ABC-DEF';
    process.env.TELEGRAM_CHAT_ID = '-100123456';

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    const result = await sendTelegramNotification({
      title: 'Nuevo Mensaje',
      message: 'Cliente interesado en la propuesta',
    });

    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.telegram.org/bot123456:ABC-DEF/sendMessage',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
