import Image from "next/image";
import { User } from "lucide-react"; // ASSUMPTION: lucide-react (see iconMap.js)

/**
 * Renders the founder's portrait. If no real image path is configured in
 * data/aboutProyash.js, a neutral placeholder is shown instead of a broken image.
 * Local images only — remote hosts would need next.config.js `images.remotePatterns`.
 */
export default function FounderPortrait({ portrait, className = "" }) {
  return (
    <div
      className={`relative aspect-4/5 overflow-hidden bg-emerald-100 dark:bg-emerald-900 ${className}`}
    >
      {portrait.src ? (
        <Image
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 90vw"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label="প্রতিষ্ঠাতার ছবির স্থান—প্রকৃত ছবি যুক্ত করুন"
          className="flex h-full w-full items-center justify-center text-emerald-700 dark:text-emerald-300"
        >
          <User className="h-1/3 w-1/3" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
