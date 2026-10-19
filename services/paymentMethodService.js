// Service layer for payment-method settings.
// NOTE: No Laravel endpoints exist yet. Every function is a SIMULATION that works on local sample data.
// Replace each body with a call through the project's API client (auth included) and keep the signatures.
// Never keep real payment credentials in client storage; the backend owns them.
import { samplePaymentMethods } from "@/data/samplePaymentMethods";

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString().slice(0, 10);
let seq = samplePaymentMethods.length + 1;

export async function fetchPaymentMethods() { await wait(); return structuredClone(samplePaymentMethods); }       // TODO: GET payment methods
export async function createPaymentMethod(payload) {                                                               // TODO: POST (server assigns the id)
  await wait(); return { ...payload, id: `pm-new-${seq++}`, updatedAt: now() };
}
export async function updatePaymentMethod(id, patch) { await wait(); return { ...patch, updatedAt: now() }; }     // TODO: PATCH
export async function activatePaymentMethod(id) { await wait(); return { isActive: true, updatedAt: now() }; }    // TODO: POST activate (server re-validates)
export async function deactivatePaymentMethod(id) { await wait(); return { isActive: false, updatedAt: now() }; } // TODO: POST deactivate
export async function deletePaymentMethod(id) { await wait(); return { deleted: true }; }                         // TODO: DELETE (server must enforce usage rules)

// The frontend has no donation history for a method, so it reports "not checked".
// The real endpoint should return { checked: true, hasDonations: boolean }.
export async function checkPaymentMethodUsage(id) { await wait(200); return { checked: false, hasDonations: null }; } // TODO: GET usage
export async function uploadPaymentMethodLogo(file) { await wait(); return { logoUrl: null }; }                    // TODO: multipart upload; not stored here
