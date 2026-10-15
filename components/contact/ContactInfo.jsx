import { MapPin, Mail, Phone, Users } from "lucide-react";
import { infoCards, contactDetails, socialLinks } from "@/data/contact";

const cardBase =
  "group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none";

const iconWrap =
  "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#1F4D2B] transition group-hover:bg-[#1F4D2B] group-hover:text-white";

const linkClass =
  "inline-flex items-center text-sm font-semibold text-[#1F4D2B] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D2B]";

function Card({ icon: Icon, title, description, children }) {
  return (
    <article className={cardBase}>
      <div className={iconWrap}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
      {children && <div className="mt-auto pt-4">{children}</div>}
    </article>
  );
}

export default function ContactInfo() {
  const hasEmail = Boolean(contactDetails.email);
  const hasPhone = Boolean(contactDetails.phone);
  const hasSocial = socialLinks.length > 0;

  return (
    <section
      aria-labelledby="contact-info-heading"
      className="bg-neutral-50 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="contact-info-heading" className="sr-only">
          Contact information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={MapPin}
            title={infoCards.location.title}
            description={infoCards.location.description}
          />

          {hasEmail && (
            <Card
              icon={Mail}
              title={infoCards.email.title}
              description={infoCards.email.description}
            >
              <a href={`mailto:${contactDetails.email}`} className={linkClass}>
                {contactDetails.email}
              </a>
            </Card>
          )}

          {hasPhone && (
            <Card
              icon={Phone}
              title={infoCards.phone.title}
              description={infoCards.phone.description}
            >
              <a
                href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}
                className={linkClass}
              >
                {contactDetails.phone}
              </a>
            </Card>
          )}

          {hasSocial && (
            <Card
              icon={Users}
              title={infoCards.social.title}
              description={infoCards.social.description}
            >
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {socialLinks.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
