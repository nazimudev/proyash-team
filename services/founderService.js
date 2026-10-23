// Founder service layer.
// NO founder API exists yet, and there is no data source for real founder profiles, so fetchFounders returns an
// empty list. Every write throws BackendNotConnectedError so the page never reports a save, publish, or delete
// that did not happen.
//
// Before wiring the real API, check how the PUBLIC founder section currently stores and renders its content, and
// map field names to it. Then replace each body with a call through the project's API client (auth attached):
//   - createFounder / updateFounder: send `fields` (plus the photo as multipart/form-data when one is chosen;
//     `removePhoto` asks the server to clear it). The backend must authorize administrators, re-validate the photo,
//     and decide whether two profiles is enforced.
//   - Resolve ONLY after the backend confirms, with the saved record: { founder }. Validation failures should throw an
//     error with `fieldErrors` ({ full_name_en: "message" }).
//   - Only profiles whose status is "published" may reach the public website.
export class BackendNotConnectedError extends Error {
  constructor() {
    super("The founder API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function fetchFounders() {
  await wait();
  return [];
} // TODO: GET founders (admin: all statuses)
export async function createFounder({ fields, photoFile }) {
  void fields;
  void photoFile;
  throw new BackendNotConnectedError();
} // TODO: POST
export async function updateFounder(id, { fields, photoFile, removePhoto }) {
  void id;
  void fields;
  void photoFile;
  void removePhoto;
  throw new BackendNotConnectedError();
} // TODO: PATCH
export async function setFounderStatus(id, status) {
  void id;
  void status;
  throw new BackendNotConnectedError();
} // TODO: publish / unpublish
export async function deleteFounder(id) {
  void id;
  throw new BackendNotConnectedError();
} // TODO: DELETE
