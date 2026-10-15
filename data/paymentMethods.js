/**
 * MANUAL PAYMENT METHODS — public instructions and account details only.
 * Never put PINs, OTPs, passwords or API secrets here (this ships to the browser).
 *
 * Every method is DISABLED and EMPTY. Do not invent account numbers. A method becomes
 * selectable only when `enabled` is true AND its required fields are filled
 * (see isMethodAvailable in lib/payment.js); otherwise it shows "Not yet available".
 *
 * Fill per method:
 *   mobile (bkash, rocket, nagad): accountNumber, accountType ("Personal" | "Merchant" | ...),
 *                                  instructions[] written for THAT provider's real flow
 *   bank:                          bankName, accountHolder, accountNumber, branchName, routingNumber?, instructions[]
 *   cash:                          instructions[] describing how it is documented and verified
 *                                  (do not invent an address or collection procedure)
 *
 * transactionId: how the donor's transaction/reference ID is validated in the form.
 *   `pattern` is a regex string. The default below is deliberately generic (letters, digits, - _ /).
 *   Replace it with each provider's confirmed format before relying on it.
 */
const genericTransactionId = {
  required: true,
  label: "Transaction ID",
  hint: "Copy it from the confirmation you received after paying.",
  minLength: 6,
  maxLength: 40,
  pattern: "^[A-Za-z0-9_/-]+$",
};

export const paymentMethods = {
  bkash: {
    kind: "mobile",
    enabled: true,
    displayName: "bKash",
    accountNumber: "01786368993",
    accountType: "Personal",
    instructions: [
      "Open your bKash app and select Send Money.",
      "Enter the organization's bKash personal number shown above.",
      "Enter your donation amount and carefully check the recipient's number before proceeding.",
      "Confirm the transaction by following the instructions in your bKash app.",
      "After a successful transaction, copy the Transaction ID (TrxID) from the confirmation screen or SMS.",
      "Enter your phone number, donation amount, and TrxID in the form below, then submit your donation for verification.",
      "Your donation will be marked as confirmed after the organization verifies the transaction.",
    ],
    needsPhone: true,
    transactionId: { ...genericTransactionId, label: "bKash transaction ID" },
  },
  rocket: {
    kind: "mobile",
    enabled: false,
    displayName: "Rocket",
    accountNumber: "",
    accountType: "",
    instructions: [],
    needsPhone: true,
    transactionId: { ...genericTransactionId, label: "Rocket transaction ID" },
  },
  nagad: {
    kind: "mobile",
    enabled: false,
    displayName: "Nagad",
    accountNumber: "",
    accountType: "",
    instructions: [],
    needsPhone: true,
    transactionId: { ...genericTransactionId, label: "Nagad transaction ID" },
  },
  bankTransfer: {
    kind: "bank",
    enabled: false,
    displayName: "Bank Transfer",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branchName: "",
    routingNumber: "",
    instructions: [],
    needsPhone: false,
    transactionId: {
      ...genericTransactionId,
      label: "Bank transaction or reference number",
    },
  },
  cash: {
    kind: "cash",
    enabled: false,
    displayName: "Cash or Other Approved Method",
    instructions: [],
    needsPhone: true,
    transactionId: {
      required: false,
      label: "Receipt or reference (if any)",
      hint: "",
      minLength: 0,
      maxLength: 40,
      pattern: "^[A-Za-z0-9_/ -]*$",
    },
  },
};

export const paymentMethodOrder = [
  "bkash",
  "rocket",
  "nagad",
  "bankTransfer",
  "cash",
];
