// src/components/contact/ContactInfo.jsx  (server component)
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactInfo({ settings = {} }) {
  const { phone, email, workingHours } = settings;

  const items = [
    {
      key: "address",
      icon: MapPin,
      label: "Address",
      value: "Madhupur, Tangail, Bangladesh",
    },
    phone && {
      key: "phone",
      icon: Phone,
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
    },
    email && {
      key: "email",
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    workingHours && {
      key: "hours",
      icon: Clock,
      label: "Working Hours",
      value: workingHours,
    },
  ].filter(Boolean);

  return (
    <section
      aria-label="Contact information"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <ul className="-mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon, label, value, href }) => (
          <li
            key={key}
            className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-forest">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-sm font-semibold text-gray-500">
              {label}
            </h2>
            {href ? (
              <a
                href={href}
                className="mt-1 block wrap-break-word font-semibold text-gray-900 hover:text-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
              >
                {value}
              </a>
            ) : (
              <p className="mt-1 whitespace-pre-line font-semibold text-gray-900">
                {value}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
