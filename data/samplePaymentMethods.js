// SAMPLE DATA ONLY. No real Proyash account numbers. Masked placeholders are for preview.
// Configuration is separate from donation transactions; donations reference a method by id.
const m = (o) => ({ accountHolder: "", description: "", instructions: [], requiresTransactionId: false, requiresPhone: false,
  requiresPaymentProof: false, isActive: false, updatedAt: null, ...o });

const mobileSteps = (name) => [
  `Open your ${name} app.`,
  "Send the donation to the account shown on the donation page.",
  "Copy the transaction ID from the confirmation.",
  "Enter the transaction ID in the donation form.",
  "Submit the donation for verification.",
];

export const samplePaymentMethods = [
  m({ id: "pm-bkash", name: "bKash", type: "mobile", accountNumber: "01XXXXXXXXX", accountHolder: "Sample Account Holder",
      description: "Send your donation to the configured bKash account and submit the transaction ID for verification.",
      instructions: mobileSteps("bKash"), requiresTransactionId: true, requiresPhone: true, isActive: true, displayOrder: 1, updatedAt: "2026-10-01" }),
  m({ id: "pm-nagad", name: "Nagad", type: "mobile", accountNumber: "01XXXXXXXXX", accountHolder: "Sample Account Holder",
      description: "Send your donation to the configured Nagad account and submit the transaction ID for verification.",
      instructions: mobileSteps("Nagad"), requiresTransactionId: true, requiresPhone: true, isActive: true, displayOrder: 2, updatedAt: "2026-10-01" }),
  m({ id: "pm-rocket", name: "Rocket", type: "mobile", accountNumber: "", displayOrder: 3 }), // not configured yet
  m({ id: "pm-bank", name: "Bank Transfer", type: "bank", accountNumber: "XXXX-XXXX-0000", accountHolder: "Sample Account Name",
      description: "Transfer to the bank account shown, then upload your receipt.",
      instructions: ["Transfer the amount to the account shown.", "Keep the bank receipt.", "Upload the receipt in the donation form."],
      requiresPaymentProof: true, isActive: true, displayOrder: 4, updatedAt: "2026-09-20" }),
  m({ id: "pm-cash", name: "Cash", type: "cash", accountNumber: "Contact the organization",
      description: "Arrange a cash donation by contacting the organization.", instructions: ["Contact the organization to arrange a handover."],
      isActive: true, displayOrder: 5, updatedAt: "2026-09-20" }),
  m({ id: "pm-other", name: "Other", type: "other", accountNumber: "", displayOrder: 6 }), // not configured yet
];
