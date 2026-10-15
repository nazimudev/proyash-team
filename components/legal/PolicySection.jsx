import styles from "./privacy.module.css";

export default function PolicySection({ section, children }) {
  const headingId = `${section.id}-heading`;
  return (
    <section id={section.id} aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId}>{section.title}</h2>
      {section.blocks.map((b, i) => {
        if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        if (b.type === "note")
          return (
            <p key={i} className={styles.note}>
              <strong>Important: </strong>
              {b.text}
            </p>
          );
        return <p key={i}>{b.text}</p>;
      })}
      {children}
    </section>
  );
}
