// SAMPLE DATA ONLY. Fictional senders with fake contact details (example.com addresses, made-up numbers).
// None of this is a real message. Timestamps are plain local strings (YYYY-MM-DDTHH:mm).
const m = (n, o) => ({
  id: `msg-demo-${String(n).padStart(3, "0")}`,
  phone: `0190000${String(n).padStart(4, "0")}`,
  email: `sender${String(n).padStart(2, "0")}@example.com`,
  status: "new",
  ...o,
});

export const sampleContactMessages = [
  m(1, {
    name: "Sample Sender 01",
    subject: "Question about volunteering",
    status: "new",
    created_at: "2026-10-18T09:30",
    message:
      "Hello,\n\nI would like to know how I can volunteer with Proyash Songgothon.\n\nThank you.",
  }),
  m(2, {
    name: "Sample Sender 02",
    subject: "Donation receipt",
    status: "new",
    created_at: "2026-10-17T16:05",
    message:
      "Hi, I made a sample donation last week and would like a receipt. (Demo message.)",
  }),
  m(3, {
    name: "Sample Sender 03",
    subject: "Partnership idea",
    status: "read",
    created_at: "2026-10-16T11:20",
    message:
      "We are a sample organization interested in a joint tree plantation event.\nCould someone get in touch?",
  }),
  m(4, {
    name: "Sample Sender 04",
    subject: "Rendering test: markup is shown as plain text",
    status: "new",
    created_at: "2026-10-15T08:45",
    message:
      "<script>alert('not run')</script> <b>This should appear as literal text, not bold.</b>\n\nLine two after a blank line.",
  }),
  m(5, {
    name: "Sample Sender 05",
    subject: "Membership fee question",
    status: "replied",
    created_at: "2026-10-14T13:10",
    message: "How do I pay the membership fee after approval? (Demo message.)",
  }),
  m(6, {
    name: "Sample Sender 06",
    subject:
      "A very long subject line used to test how the table and details view handle text that keeps going and going",
    status: "read",
    created_at: "2026-10-12T10:00",
    message: "Long message for layout testing. ".repeat(40).trim(),
  }),
  m(7, {
    name: "Sample Sender 07",
    subject: "Event invitation",
    status: "new",
    created_at: "2026-10-11T19:25",
    email: null,
    message:
      "This sample message has no email address, so Email and Copy Email are not shown.",
  }),
  m(8, {
    name: "Sample Sender 08",
    subject: "Photo request",
    status: "archived",
    created_at: "2026-10-09T15:40",
    message: "Can I use a photo from the gallery? (Demo message.)",
  }),
  m(9, {
    name: "Sample Sender 09",
    subject: "Thanks for the help",
    status: "replied",
    created_at: "2026-10-07T12:15",
    message: "Thank you to the team for the school supplies. (Demo message.)",
  }),
  m(10, {
    name: "Sample Sender 10",
    subject: "Complaint about a delay",
    status: "read",
    created_at: "2026-10-05T17:50",
    phone: null,
    message:
      "This sample message has no phone number, so Call and Copy Phone are not shown.",
  }),
  m(11, {
    name: "Sample Sender 11",
    subject: "Office address",
    status: "archived",
    created_at: "2026-09-29T09:05",
    message: "Where is your office located? (Demo message.)",
  }),
  m(12, {
    name: "Sample Sender 12",
    subject: "Press inquiry",
    status: "new",
    created_at: "2026-09-27T14:30",
    message:
      "A sample journalist would like to ask a few questions. (Demo message.)",
  }),
];
