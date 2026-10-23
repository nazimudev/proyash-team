// ADMIN contact message service.
// NO contact-message API exists yet. Reading returns clearly-labelled sample data; every write throws
// BackendNotConnectedError so the page never reports a status change or deletion that did not happen.
//
// When the Laravel endpoints exist, replace each body with a call through the project's API client (auth attached).
// Every endpoint must require an authenticated, authorized administrator, and must never be reachable publicly.
// Resolve ONLY after the backend confirms. For status/archive/restore resolve with { message } (the saved record).
import { sampleContactMessages } from "@/data/contactMessagesSample";
import { BackendNotConnectedError } from "./contactErrors";

export { BackendNotConnectedError };
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function fetchContactMessages() {
  await wait();
  return structuredClone(sampleContactMessages);
} // TODO: GET messages (paginated, admin-only)
export async function fetchContactMessage(id) {
  // TODO: GET one message (full text)
  await wait(450);
  const found = sampleContactMessages.find((x) => x.id === id);
  if (!found) throw new Error("Message not found");
  return structuredClone(found);
}
export async function updateMessageStatus(id, status) {
  void id;
  void status;
  throw new BackendNotConnectedError();
} // TODO: PATCH status (read | replied | archived | restore)
export async function deleteContactMessage(id) {
  void id;
  throw new BackendNotConnectedError();
} // TODO: DELETE (or soft delete)
