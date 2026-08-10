import { NextResponse } from 'next/server';
import { getCurrentAccount, toErrorResponse } from '@/lib/auth/account';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const { accountId, userId } = await getCurrentAccount();

    const limit = checkRateLimit(`mp-payment:${userId}`, RATE_LIMITS.send);
    if (!limit.success) return rateLimitResponse(limit);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Body de solicitud inválido' }, { status: 400 });
    }

    const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Cobro CRM';
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'El monto debe ser un número positivo' }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            'MercadoPago no está configurado. Define la variable de entorno MP_ACCESS_TOKEN en tu servidor.',
        },
        { status: 500 },
      );
    }

    const currencyId = typeof body.currency === 'string' && body.currency.trim() ? body.currency.trim().toUpperCase() : 'ARS';

    const mpRes = await fetch('https://api.mercadopago.com/v1/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title,
            quantity: 1,
            unit_price: amount,
            currency_id: currencyId,
          },
        ],
        external_reference: `crm_acc_${accountId}`,
      }),
    });

    const mpData = await mpRes.json().catch(() => null);

    if (!mpRes.ok || !mpData) {
      console.error('[MercadoPago API Error]', mpData);
      return NextResponse.json(
        { error: mpData?.message || 'Error al comunicarse con MercadoPago' },
        { status: 400 },
      );
    }

    const paymentUrl = mpData.init_point || mpData.sandbox_init_point;

    return NextResponse.json({
      success: true,
      init_point: paymentUrl,
      preference_id: mpData.id,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
