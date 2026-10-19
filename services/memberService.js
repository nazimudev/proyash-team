// Member service layer.
// There is NO member-creation API yet, so createMember does not pretend to save anything: it throws
// BackendNotConnectedError, and the page tells the administrator the member was not created.
//
// When the Laravel endpoint exists, replace the body (use the project's API client so auth is attached):
//   - Send `fields` (plus `photoFile` as multipart/form-data) to the real endpoint.
//   - Do NOT send status, user_id, reviewed_by, reviewed_at, rejection_reason, id, or timestamps.
//     The backend must authorize the administrator and assign the member's status and any linked user account.
//   - Resolve ONLY after the backend confirms the member was created.
//   - On validation failure (for example HTTP 422) throw an error with `fieldErrors`: { field_name: "message" }.
export class BackendNotConnectedError extends Error {
  constructor() {
    super("The member creation API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

export async function createMember(request) {
  void request;
  throw new BackendNotConnectedError();
}
