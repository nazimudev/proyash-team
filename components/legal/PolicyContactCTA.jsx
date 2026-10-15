import Link from "next/link";
import styles from "./privacy.module.css";

export default function PolicyContactCTA({ config }) {
  const { contact, routes } = config;
  const hasDetails = contact.email || contact.phone || contact.address;
  const related = [
    [routes.donation, "Donate"],
    [routes.terms, "Terms of Service"],
    [routes.refund, "Refund Policy"],
  ].filter(([href]) => Boolean(href));

  return (
    <div className={styles.contactCard}>
      <h3>Questions about your privacy?</h3>
      <p>
        If you have questions about this Privacy Policy or how your information is handled,
        please contact {config.organizationName}.
      </p>
      {hasDetails && (
        <ul className={styles.contactList}>
          {contact.email && (
            <li>
              Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          )}
          {contact.phone && <li>Phone: {contact.phone}</li>}
          {contact.address && <li>Address: {contact.address}</li>}
        </ul>
      )}
      {routes.contact && (
        <Link href={routes.contact} className={styles.button}>
          Contact us
        </Link>
      )}
      {related.length > 0 && (
        <div className={styles.related}>
          {related.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
