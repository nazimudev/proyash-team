"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { getInitials } from "@/lib/founderUtils";

// Shows the photo, or a neutral placeholder when there is none or it fails to load.
export default function FounderPhoto({ founder, className = "", src }) {
  const [failed, setFailed] = useState(null);
  const url = src ?? founder?.photo_url;
  if (url && failed !== url) {
    return <img src={url} alt={founder?.full_name_en ? `Photo of ${founder.full_name_en}` : "Founder photo"} onError={() => setFailed(url)} className={`object-cover ${className}`} />;
  }
  const initials = getInitials(founder?.full_name_en);
  return (
    <div role="img" aria-label="No photo added" className={`flex items-center justify-center bg-green-50 text-green-700 ${className}`}>
      {initials ? <span className="text-3xl font-semibold" aria-hidden="true">{initials}</span> : <User className="h-10 w-10" aria-hidden="true" />}
    </div>
  );
}
