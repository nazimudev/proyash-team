import LegalPageHeader from "@/components/legal/LegalPageHeader";
import PolicyTableOfContents from "@/components/legal/PolicyTableOfContents";
import PolicySection from "@/components/legal/PolicySection";
import PolicyContactCTA from "@/components/legal/PolicyContactCTA";
import styles from "@/components/legal/privacy.module.css";
import { policyConfig, policySections } from "@/data/privacyPolicy";

export const metadata = {
  title: "Privacy Policy | Proyash",
  description:
    "Read how Proyash handles personal information, donation submissions, donor privacy, and website-related communications.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <LegalPageHeader config={policyConfig} />
      <div className={`${styles.wrap} ${styles.layout}`}>
        <PolicyTableOfContents sections={policySections} />
        <main className={styles.content}>
          {policySections.map((section) => (
            <PolicySection key={section.id} section={section}>
              {section.id === "contact-us" && (
                <PolicyContactCTA config={policyConfig} />
              )}
            </PolicySection>
          ))}
        </main>
      </div>
    </div>
  );
}
