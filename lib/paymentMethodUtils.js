import { Smartphone, Landmark, Banknote, Wallet } from "lucide-react";

// Configurable so more types can be added later.
export const PAYMENT_TYPES = [
  { value: "mobile", label: "Mobile Financial Service", icon: Smartphone, accountLabel: "Account Number", accountHint: "The number donors send money to." },
  { value: "bank", label: "Bank Transfer", icon: Landmark, accountLabel: "Bank Account Number", accountHint: "Any account number format is accepted." },
  { value: "cash", label: "Cash", icon: Banknote, accountLabel: "Payment Destination", accountHint: "For example: Contact the organization." },
  { value: "other", label: "Other", icon: Wallet, accountLabel: "Account / Payment Destination", accountHint: "Where or how donors should pay." },
];
export const typeInfo = (v) => PAYMENT_TYPES.find((t) => t.value === v) ?? PAYMENT_TYPES[3];

// Transaction ID default by type: on for mobile services, optional (off) for bank, off for cash.
export const defaultRequiresTransactionId = (type) => type === "mobile";

export const NOT_CONFIGURED = "Account details not configured";

// Masks account numbers for the donor-facing preview.
export function maskDestination(method) {
  const v = method.accountNumber?.trim();
  if (!v) return NOT_CONFIGURED;
  if (method.type === "mobile" && v.length > 4) return v.slice(0, 2) + "X".repeat(v.length - 4) + v.slice(-2);
  if (method.type === "bank" && v.length > 4) return `•••• ${v.slice(-4)}`;
  return v;
}

// A method can only be active when donors would have something to act on.
export function activationIssues(m) {
  const issues = [];
  if (!m.accountNumber?.trim()) issues.push(`add the ${typeInfo(m.type).accountLabel.toLowerCase()}`);
  if (!m.description?.trim()) issues.push("add payment instructions");
  return issues;
}

export function calculateSummary(methods) {
  const active = methods.filter((x) => x.isActive).length;
  return { total: methods.length, active, inactive: methods.length - active };
}

export const EMPTY_FILTERS = { search: "", type: "all", status: "all" };

export function filterMethods(methods, f) {
  const q = f.search.trim().toLowerCase();
  return methods
    .filter((x) => (!q || x.name.toLowerCase().includes(q))
      && (f.type === "all" || x.type === f.type)
      && (f.status === "all" || (f.status === "active") === x.isActive))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

let stepCounter = 0;
export const newStep = (text = "") => ({ key: `s${++stepCounter}`, text });

export function emptyMethodValues(nextOrder) {
  return { name: "", type: "mobile", description: "", accountNumber: "", accountHolder: "", steps: [newStep()],
    requiresTransactionId: defaultRequiresTransactionId("mobile"), requiresPhone: false, requiresPaymentProof: false,
    displayOrder: String(nextOrder), isActive: false };
}

export const methodToValues = (x) => ({
  name: x.name, type: x.type, description: x.description, accountNumber: x.accountNumber, accountHolder: x.accountHolder,
  steps: x.instructions.length ? x.instructions.map((t) => newStep(t)) : [newStep()],
  requiresTransactionId: x.requiresTransactionId, requiresPhone: x.requiresPhone, requiresPaymentProof: x.requiresPaymentProof,
  displayOrder: String(x.displayOrder), isActive: x.isActive,
});

export function validateMethodForm(v, methods, editingId) {
  const e = {};
  const name = v.name.trim();
  if (!name) e.name = "Enter a payment method name.";
  else if (name.length > 60) e.name = "Use 60 characters or fewer.";
  else if (methods.some((m) => m.id !== editingId && m.name.trim().toLowerCase() === name.toLowerCase()))
    e.name = "A payment method with this name already exists.";
  if (!PAYMENT_TYPES.some((t) => t.value === v.type)) e.type = "Choose a payment type.";
  if (!v.description.trim()) e.description = "Explain how donors should pay with this method.";
  if (!/^\d{1,4}$/.test(v.displayOrder.trim())) e.displayOrder = "Enter a whole number from 0 to 9999.";
  if (v.isActive) {
    if (!v.accountNumber.trim()) e.accountNumber = `Add the ${typeInfo(v.type).accountLabel.toLowerCase()} before activating, or turn Active off.`;
  }
  return e;
}

export function formValuesToMethod(v) {
  return {
    name: v.name.trim(), type: v.type, description: v.description.trim(), accountNumber: v.accountNumber.trim(),
    accountHolder: v.type === "cash" ? "" : v.accountHolder.trim(),
    instructions: v.steps.map((s) => s.text.trim()).filter(Boolean),
    requiresTransactionId: v.requiresTransactionId, requiresPhone: v.requiresPhone, requiresPaymentProof: v.requiresPaymentProof,
    displayOrder: Number(v.displayOrder), isActive: v.isActive,
  };
}
