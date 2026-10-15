import GalleryBrowser from "@/components/gallery/GalleryBrowser";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import GalleryHero from "@/components/gallery/GalleryHero";
import { getGalleryData } from "@/lib/gallery";

export const metadata = {
  title: "Gallery | Proyash Songgothon",
  description:
    "Explore photographs of Proyash Songgothon's community support, educational support, tree plantation, and other documented activities.",
};

import React from "react";

const GalleryPage = () => {
  const { categories, images } = getGalleryData();

  return (
    <>
    <GalleryHero />
    <GalleryBrowser categories={categories} images={images} />
    <GalleryCTA />
    </>
  );
};

export default GalleryPage;
