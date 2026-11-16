// src/app/(public)/contact/page.jsx  (server component)
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import ContactCTA from "@/components/contact/ContactCTA";
import { getContactSettings } from "@/services/contactApi";

export const metadata = {
  title: "Contact Us | Proyash Songgothon",
  description:
    "Get in touch with Proyash Songgothon. Send us your questions, ideas, and suggestions.",
};

export default async function ContactPage() {
  const settings = await getContactSettings();

  return (
    <main>
      <ContactHero />
      <ContactInfo settings={settings} />

      <section
        aria-labelledby="contact-form-heading"
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <h2
          id="contact-form-heading"
          className="mb-6 text-2xl font-bold text-gray-900"
        >
          Send us a message
        </h2>
        <ContactForm />
      </section>

      <ContactMap mapUrl={settings.mapUrl} />

      <div className="py-16">
        <ContactCTA />
      </div>
    </main>
  );
}
