// Project service layer.
// NOTE: No Laravel endpoint exists yet. createProject is a SIMULATION: it waits briefly and returns the
// project it was given. Nothing is saved anywhere. Replace the body with a real API call through the
// project's API client (with auth) and keep the signature. Validation errors from the server should be
// returned in the same { field: message } shape the form already uses.
const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function createProject(project) {
  await wait();
  return { ...project, createdLocallyOnly: true };
}
