// Frontend helper functions that call this backend's /api/* routes.
// These belong in the frontend project; kept here so they are not lost.
const BACKEND_URL = 'https://YOUR-BACKEND-URL.onrender.com';
async function getRealPrices(country, product) {
  const r = await fetch(BACKEND_URL + '/api/prices?country=' + (country || 'us') + '&product=' + (product || 'whatsapp'));
  return r.json();
}
async function buyRealNumber(country, product, operator) {
  const r = await fetch(BACKEND_URL + '/api/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ country: country, product: product, operator: operator || 'any' }) });
  return r.json();
}
async function getRealSMS(orderId) {
  const r = await fetch(BACKEND_URL + '/api/check?id=' + orderId);
  return r.json();
}
async function getRealBalance() {
  const r = await fetch(BACKEND_URL + '/api/profile');
  return r.json();
}
