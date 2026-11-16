import GalleryBrowser from "@/components/gallery/GalleryBrowser";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import GalleryHero from "@/components/gallery/GalleryHero";
import { getPublicGallery } from "@/services/galleryService";

export const metadata = {
  title: "Gallery | Proyash Songgothon",
  description:
    "Explore photographs of Proyash Songgothon's community support, educational support, tree plantation, and other documented activities.",
};

import React from "react";

export default async function GalleryPage() {

  const galleryCategories = [
    { id: "all", label: "All Photos" },
    { id: "community", label: "Community Support" },
    { id: "education", label: "Educational Support" },
    { id: "environment", label: "Tree Plantation" },
    { id: "events", label: "Events & Activities" },
  ];

  let images = [];
  let status = "ready";

  try {
    images = await getPublicGallery();
  } catch (error) {
    console.error("Gallery API Error:", error);
    status = "error";
  }

  return (
    <>
    <GalleryHero />
    <GalleryBrowser categories={galleryCategories} images={images} status={status} />
    <GalleryCTA />
    </>
  );
};

