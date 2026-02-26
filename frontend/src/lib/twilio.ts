const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;

export async function sendOTP(phone: string): Promise<void> {
  await fetch(`${WORKER_URL}/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const res = await fetch(`${WORKER_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  });
  const data = await res.json();
  return data.valid === true;
}
