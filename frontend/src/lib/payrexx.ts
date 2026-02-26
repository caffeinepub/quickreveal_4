const PAYREXX_BASE = 'https://nexus.payrexx.com';
const INSTANCE = import.meta.env.VITE_PAYREXX_INSTANCE as string;
const SECRET = import.meta.env.VITE_PAYREXX_SECRET as string;

export async function createSubscriptionUrl(
  proId: string,
  email: string,
  phone: string
): Promise<string> {
  const params = new URLSearchParams({
    amount: '1990',
    currency: 'CHF',
    'psp[0]': 'twint',
    purpose: 'Abonnement NEXUS Pro 7j',
    referenceId: `sub_${proId}_${Date.now()}`,
    successRedirect: `${window.location.origin}/pro/success`,
    failedRedirect: `${window.location.origin}/pro/failed`,
    'fields[email][value]': email,
    'fields[phone][value]': phone,
  });

  const response = await fetch(`${PAYREXX_BASE}/api/v1/Gateway/`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${INSTANCE}:${SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  return data.data?.[0]?.link ?? '';
}

export async function createBookingUrl(
  bookingId: string,
  montant: number,
  serviceName: string,
  email: string
): Promise<string> {
  const params = new URLSearchParams({
    amount: String(Math.round(montant * 100)),
    currency: 'CHF',
    'psp[0]': 'twint',
    purpose: `NEXUS - ${serviceName}`,
    referenceId: `booking_${bookingId}`,
    successRedirect: `${window.location.origin}/booking/paid/${bookingId}`,
    failedRedirect: `${window.location.origin}/booking/failed/${bookingId}`,
    'fields[email][value]': email,
  });

  const response = await fetch(`${PAYREXX_BASE}/api/v1/Gateway/`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${INSTANCE}:${SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  return data.data?.[0]?.link ?? '';
}
