// Every service throws this on failure so pages can handle mock and API errors identically.
// `errors` is a flat map: { fieldName: 'first message' } (Laravel 422 arrays are flattened by apiClient).
export class MemberApiError extends Error {
  constructor(message, { status = 0, errors = {} } = {}) {
    super(message);
    this.name = 'MemberApiError';
    this.status = status;
    this.errors = errors;
  }
}
