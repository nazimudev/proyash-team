/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Images, RefreshCw } from "lucide-react";

import ProjectSelector from "@/components/admin/project-images/ProjectSelector";
import ImageDropzone from "@/components/admin/project-images/ImageDropzone";
import SelectedImageList from "@/components/admin/project-images/SelectedImageList";
import UploadProgress from "@/components/admin/project-images/UploadProgress";
import ExistingImageGallery from "@/components/admin/project-images/ExistingImageGallery";
import ImageStats from "@/components/admin/project-images/ImageStats";

import {
  fetchProjectImages,
  uploadProjectImages,
  deleteProjectImage,
  setFeaturedProjectImage,
} from "@/services/projectService";

export default function UploadImagePage() {
  const [projectId, setProjectId] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const selectedRef = useRef([]);

  useEffect(() => {
    selectedRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedRef.current.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const loadGallery = useCallback(async () => {
    if (!projectId) {
      setExistingImages([]);
      setGalleryError("");
      return;
    }

    try {
      setGalleryLoading(true);
      setGalleryError("");

      const data = await fetchProjectImages(projectId);

      const images = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setExistingImages(images);
    } catch (error) {
      setGalleryError(error.message);
      setExistingImages([]);
    } finally {
      setGalleryLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  function handleProjectChange(value) {
    setProjectId(value);

    setSelectedImages((previous) => {
      previous.forEach((item) => URL.revokeObjectURL(item.preview));
      return [];
    });

    setMessage(null);
    setProgress(0);
  }

  function handleFilesSelected(files) {
    setMessage(null);

    setSelectedImages((previous) => {
      const remaining = 10 - previous.length;

      if (remaining <= 0) {
        setMessage({
          type: "error",
          text: "Maximum 10 images can be uploaded at a time.",
        });
        return previous;
      }

      const accepted = files.slice(0, remaining);

      const newItems = accepted.map((file) => ({
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      if (files.length > remaining) {
        setMessage({
          type: "error",
          text: `Only ${remaining} more image(s) can be selected.`,
        });
      }

      return [...previous, ...newItems];
    });
  }

  function removeSelectedImage(id) {
    setSelectedImages((previous) => {
      const item = previous.find((image) => image.id === id);

      if (item) {
        URL.revokeObjectURL(item.preview);
      }

      return previous.filter((image) => image.id !== id);
    });
  }

  async function handleUpload() {
    if (!projectId) {
      setMessage({
        type: "error",
        text: "Please select a project first.",
      });
      return;
    }

    if (!selectedImages.length || uploading) return;

    try {
      setUploading(true);
      setProgress(0);
      setMessage(null);

      const files = selectedImages.map((item) => item.file);

      await uploadProjectImages(projectId, files, setProgress);

      selectedImages.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });

      setSelectedImages([]);

      setMessage({
        type: "success",
        text: "Project images uploaded successfully.",
      });

      await loadGallery();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Image upload failed.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(imageId);
      setMessage(null);

      await deleteProjectImage(imageId);

      setMessage({
        type: "success",
        text: "Image deleted successfully.",
      });

      await loadGallery();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete image.",
      });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleFeatured(imageId) {
    try {
      setActionLoading(imageId);
      setMessage(null);

      await setFeaturedProjectImage(imageId);

      setMessage({
        type: "success",
        text: "Featured image updated successfully.",
      });

      await loadGallery();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update featured image.",
      });
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <Images size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Project Images
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Upload and manage project gallery images.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadGallery}
          disabled={!projectId || galleryLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={galleryLoading ? "animate-spin" : ""}
          />
          Refresh Gallery
        </button>
      </div>

      {message && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <ImageStats
        selectedCount={selectedImages.length}
        existingCount={existingImages.length}
        projectSelected={Boolean(projectId)}
      />

      <ProjectSelector value={projectId} onChange={handleProjectChange} />

      {projectId ? (
        <>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Upload New Images
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select up to 10 JPG, PNG or WEBP images at a time.
              </p>
            </div>

            <ImageDropzone onFilesSelected={handleFilesSelected} />

            <SelectedImageList
              images={selectedImages}
              onRemove={removeSelectedImage}
              disabled={uploading}
            />

            <UploadProgress
              count={selectedImages.length}
              progress={progress}
              uploading={uploading}
              onUpload={handleUpload}
              disabled={!projectId}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Existing Gallery
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the images already uploaded to this project.
              </p>
            </div>

            <ExistingImageGallery
              images={existingImages}
              loading={galleryLoading}
              error={galleryError}
              onDelete={handleDelete}
              onFeatured={handleFeatured}
              actionLoading={actionLoading}
            />
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Images className="mx-auto text-gray-300" size={42} />

          <h3 className="mt-3 font-semibold text-gray-800">Select a project</h3>

          <p className="mt-1 text-sm text-gray-500">
            Choose a project above to upload and manage its images.
          </p>
        </div>
      )}
    </div>
  );
}
