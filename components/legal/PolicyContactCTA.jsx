import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { site, links } from "@/data/site";

/** Closing contact box. Uses only configured details: the location, the Facebook page and the homepage Contact section. */
export default function PolicyContactCTA({ title, text }) {
  return (
    <aside aria-labelledby="policy-contact-heading" className="mt-14 rounded-2xl border border-forest/15 bg-mist p-7 sm:p-9">
      <h2 id="policy-contact-heading" className="text-2xl font-extrabold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-xl text-muted">{text}</p>
      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
        <MapPin size={16} aria-hidden="true" className="text-forest" />
        {site.location}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href="/contact">Contact Us</Button>
        <Button {...links.facebook} variant="outline">Visit our Facebook page</Button>
      </div>
    </aside>
  );
}
