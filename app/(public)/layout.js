import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React, { Suspense } from "react";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Suspense fallback={<div className="h-16" aria-hidden="true" />}>
        <Navbar />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
