// Gallery service layer.
// NO gallery API exists yet. Reading returns clearly-labelled sample data; every write throws
// BackendNotConnectedError so the page never reports an upload, edit, publish, or delete that did not happen.
//
// When the Laravel endpoints exist, replace each body with a call through the project's API client (auth attached):
//   - createPhoto / updatePhoto: send the fields plus the image as multipart/form-data (FormData), not Base64.
//     Skip the file entirely when updating metadata only.
//   - The backend must authorize administrators, re-validate the file type, size, and content (frontend checks are
//     only a convenience), and decide the final status. Only "published" photos may reach the public gallery.
//   - Resolve ONLY after the backend confirms, with the saved record: { photo }. Validation failures should throw an
//     error with `fieldErrors` ({ title: "message" }).
//   - deletePhoto must make the public gallery stop showing the image once it resolves.
import { sampleGalleryPhotos } from "@/data/adminGallery";

export class BackendNotConnectedError extends Error {
  constructor() {
    super("The gallery API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function fetchGalleryPhotos() {
  await wait();
  return structuredClone(sampleGalleryPhotos);
} // TODO: GET photos (admin: all statuses)
export async function createPhoto({ fields, imageFile }) {
  void fields;
  void imageFile;
  throw new BackendNotConnectedError();
} // TODO: POST multipart
export async function updatePhoto(id, { fields, imageFile }) {
  void id;
  void fields;
  void imageFile;
  throw new BackendNotConnectedError();
} // TODO: PATCH
export async function setPhotoStatus(id, status) {
  void id;
  void status;
  throw new BackendNotConnectedError();
} // TODO: POST publish / unpublish
export async function deletePhoto(id) {
  void id;
  throw new BackendNotConnectedError();
} // TODO: DELETE
