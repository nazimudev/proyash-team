import ContactCTA from "@/components/contact/ContactCTA";
import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata = {
  title: "Contact Us | Proyash",
  description:
    "Get in touch with Proyash in Madhupur, Tangail. Ask a question, propose an initiative, discuss a partnership, or find out how to volunteer.",
};

const ContactPage = () => {
  return (
    <main className="min-h-screen pt-10 overflow-x-hidden bg-white">
      <ContactHero />
      <ContactInfo />
      <section
        aria-label="Send us a message"
        className="bg-white py-12 sm:py-16"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-6xl lg:px-8">
            <ContactForm />
        </div>
      </section>
      <ContactCTA />
    </main>
  );
};

export default ContactPage;
