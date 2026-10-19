// Member request service layer.
// NO review API exists yet. Reading uses clearly-labelled sample data; the decision functions do NOT pretend
// to save anything: they throw BackendNotConnectedError and the page leaves the application unchanged.
//
// When the Laravel endpoints exist, replace each body with a call through the project's API client (auth attached).
// The backend must:
//   - authorize the administrator, and validate any status change itself (never trust a client-sent status);
//   - record the reviewer and review timestamp;
//   - on approval, move the application to the "awaiting membership fee" stage and notify the applicant of the
//     next step (paying the BDT 150 fee). Approval must NOT grant login access by itself;
//   - on rejection, store the reason privately and ensure the applicant cannot log in as a member;
//   - grant member login only once approval AND payment confirmation are both satisfied.
// Resolve only AFTER the backend confirms. On validation failure throw an error with
// `fieldErrors` ({ rejection_reason: "message" }).
import { sampleApplications } from "@/data/memberApplications";

export class BackendNotConnectedError extends Error {
  constructor() {
    super("The member review API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function fetchMemberApplications() {
  // TODO: GET applications (admin-only)
  await wait();
  return structuredClone(sampleApplications);
}

export async function approveApplication(id) {
  // TODO: POST approve
  void id;
  throw new BackendNotConnectedError();
}

export async function rejectApplication(id, reason) {
  // TODO: POST reject (reason is private to administrators)
  void id;
  void reason;
  throw new BackendNotConnectedError();
}
