// Shared by the admin and public contact services.
export class BackendNotConnectedError extends Error {
  constructor(message = "The contact message API is not connected yet.") {
    super(message);
    this.name = "BackendNotConnectedError";
  }
}
