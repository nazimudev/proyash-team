// DEMO DATA ONLY. These are not real Proyash Songgothon transactions.
// Amounts are numbers, dates are ISO strings (YYYY-MM-DD), and projectId references the sample project options.
const e = (o) => ({ paidTo: "", description: "", receiptName: null, projectId: null, ...o });

export const demoExpenses = [
  e({ id: "EXP-0001", title: "Demo: Volunteer refreshments", category: "Food and Refreshments", type: "project", projectId: "prj-demo-001",
      amount: 4200, date: "2026-10-12", paymentMethod: "Cash", paidTo: "Demo Caterer", description: "Snacks and water for volunteers during a demo distribution day." }),
  e({ id: "EXP-0002", title: "Demo: Office internet bill", category: "Utilities", type: "general",
      amount: 1800, date: "2026-10-03", paymentMethod: "bKash", paidTo: "Demo ISP Ltd.", description: "Monthly internet subscription (demo)." }),
  e({ id: "EXP-0003", title: "Demo: Saplings purchase", category: "Tree Plantation", type: "project", projectId: "prj-demo-003",
      amount: 12500, date: "2026-10-08", paymentMethod: "Bank Transfer", paidTo: "Demo Nursery", receiptName: "demo-invoice.pdf" }),
  e({ id: "EXP-0004", title: "Demo: Printing stationery", category: "Office Supplies", type: "general",
      amount: 950, date: "2026-09-27", paymentMethod: "Cash", paidTo: "Demo Print Shop" }),
  e({ id: "EXP-0005", title: "Demo: School supply kits", category: "Education Support", type: "project", projectId: "prj-demo-002",
      amount: 23000, date: "2026-09-18", paymentMethod: "Nagad", paidTo: "Demo Supplier", description: "Notebooks and pens for a demo school program." }),
  e({ id: "EXP-0006", title: "Demo: Event van rental", category: "Transportation", type: "project", projectId: "prj-demo-001",
      amount: 6000, date: "2026-10-12", paymentMethod: "Rocket", paidTo: "Demo Transport" }),
  e({ id: "EXP-0007", title: "Demo: First-aid supplies", category: "Medical Support", type: "general",
      amount: 3100, date: "2026-08-30", paymentMethod: "Cash", paidTo: "Demo Pharmacy" }),
  e({ id: "EXP-0008", title: "Demo: Sound system hire", category: "Event Management", type: "general",
      amount: 7500, date: "2026-10-15", paymentMethod: "Other", paidTo: "Demo Rentals", description: "For a demo community meeting." }),
];
