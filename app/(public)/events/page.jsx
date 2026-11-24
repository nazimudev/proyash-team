import GalleryBrowser from "@/components/gallery/GalleryBrowser";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import GalleryHero from "@/components/gallery/GalleryHero";
import { getPublicGallery } from "@/services/galleryService";

export const metadata = {
  title: "Gallery | Proyash Team",
  description:
    "Explore photographs of Proyash Team's community support, educational support, tree plantation, and other documented activities.",
};

import React from "react";

export default async function GalleryPage() {
  const galleryCategories = [
    { id: "all", label: "All Photos" },
    { id: "healthcare", label: "Healthcare" },
    { id: "education", label: "Education & Awareness" },
    { id: "humanitarian", label: "Humanitarian Assistance" },
    { id: "environmental", label: "Environmental" },
    { id: "youth", label: "Youth Development" },
    { id: "equality", label: "Equality & Social Inclusion" },
    { id: "others", label: "Others" },
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
      <GalleryBrowser
        categories={galleryCategories}
        images={images}
        status={status}
      />
      <GalleryCTA />
    </>
  );
}
