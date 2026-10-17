import LegalPageHeader from "@/components/legal/LegalPageHeader";
import PolicyTableOfContents from "@/components/legal/PolicyTableOfContents";
import PolicySection from "@/components/legal/PolicySection";
import PolicyContactCTA from "@/components/legal/PolicyContactCTA";
import Container from "@/components/ui/Container";
import {
  policyMeta,
  policySections,
  policyContact,
} from "@/data/privacyPolicy";

export const metadata = {
  title: "Privacy Policy | Proyash",
  description:
    "Read how Proyash handles personal information, donation submissions, donor privacy, and website-related communications.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPageHeader
        title={policyMeta.title}
        intro={policyMeta.intro}
        effectiveDate={policyMeta.effectiveDate}
        lastUpdated={policyMeta.lastUpdated}
      />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              <PolicyTableOfContents sections={policySections} />
            </div>
            <article className="lg:col-span-9">
              <div className="max-w-3xl space-y-10">
                {policySections.map((section, i) => (
                  <PolicySection
                    key={section.id}
                    section={section}
                    number={i + 1}
                  />
                ))}
              </div>
              <div className="max-w-3xl">
                <PolicyContactCTA
                  title={policyContact.title}
                  text={policyContact.text}
                />
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
