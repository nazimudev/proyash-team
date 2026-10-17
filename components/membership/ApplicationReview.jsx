import { joinSteps, personalFields, addressParts } from "@/data/membership";

const blank = <span className="text-muted">Not provided</span>;

function Section({ title, step, onEdit, children }) {
  return (
    <section className="rounded-2xl border border-forest/10">
      <div className="flex items-center justify-between gap-3 border-b border-forest/10 bg-mist px-5 py-3">
        <h3 className="font-extrabold text-ink">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-forest underline underline-offset-4">Edit<span className="sr-only"> {title}</span></button>
      </div>
      <dl className="grid gap-x-6 gap-y-3 p-5 sm:grid-cols-2">{children}</dl>
    </section>
  );
}
const Row = ({ label, children }) => (
  <div>
    <dt className="text-xs font-bold text-muted">{label}</dt>
    <dd className="break-words font-semibold text-ink">{children}</dd>
  </div>
);

/** Read-only summary. The password is never displayed. */
export default function ApplicationReview({ values, photo, onEdit }) {
  const present = (part) => (values.same_address ? values[`permanent_${part}`] : values[`present_${part}`]);
  return (
    <div className="space-y-6">
      <Section title={joinSteps[0].title} step={0} onEdit={onEdit}>
        {personalFields.map((f) => <Row key={f.name} label={f.label}>{values[f.name]?.trim() || blank}</Row>)}
        <Row label="Profile photo">{photo.file ? photo.file.name : blank}</Row>
      </Section>
      <Section title="Permanent address" step={1} onEdit={onEdit}>
        {addressParts.map((a) => <Row key={a.part} label={a.label}>{values[`permanent_${a.part}`]?.trim() || blank}</Row>)}
      </Section>
      <Section title={`Present address${values.same_address ? " (same as permanent)" : ""}`} step={1} onEdit={onEdit}>
        {addressParts.map((a) => <Row key={a.part} label={a.label}>{present(a.part)?.trim() || blank}</Row>)}
      </Section>
      <Section title="Account & agreement" step={2} onEdit={onEdit}>
        <Row label="Login email">{values.email}</Row>
        <Row label="Password">Set (hidden)</Row>
        <Row label="Membership conditions">Read and acknowledged</Row>
        <Row label="Applicant declaration">Confirmed</Row>
        <Row label="Privacy Policy and Terms of Service">Accepted</Row>
      </Section>
    </div>
  );
}
