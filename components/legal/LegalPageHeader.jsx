import Link from "next/link";
import styles from "./privacy.module.css";

export default function LegalPageHeader({ config }) {
  const { effectiveDate, lastUpdated, routes } = config;
  return (
    <header className={styles.hero}>
      <div className={styles.wrap}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={routes.home}>Home</Link>
            </li>
            <li aria-current="page">Privacy Policy</li>
          </ol>
        </nav>
        <p className={styles.eyebrow}>LEGAL &amp; PRIVACY</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lead}>
          Your privacy matters to us. This policy explains how {config.organizationName} handles
          information when you visit our website, contact us, or submit donation information.
        </p>
        {(effectiveDate || lastUpdated) && (
          <dl className={styles.meta}>
            {effectiveDate && (
              <div>
                <dt>Effective date:</dt>
                <dd>{effectiveDate}</dd>
              </div>
            )}
            {lastUpdated && (
              <div>
                <dt>Last updated:</dt>
                <dd>{lastUpdated}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </header>
  );
}
