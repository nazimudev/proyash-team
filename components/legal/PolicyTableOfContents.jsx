import styles from "./privacy.module.css";

function List({ sections }) {
  return (
    <ol className={styles.toc}>
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`}>{s.title}</a>
        </li>
      ))}
    </ol>
  );
}

export default function PolicyTableOfContents({ sections }) {
  return (
    <>
      <details className={styles.tocMobile}>
        <summary>On this page</summary>
        <nav aria-label="Privacy policy sections">
          <List sections={sections} />
        </nav>
      </details>
      <aside className={styles.tocDesktop}>
        <nav aria-labelledby="toc-title">
          <p id="toc-title" className={styles.tocTitle}>On this page</p>
          <List sections={sections} />
        </nav>
      </aside>
    </>
  );
}
