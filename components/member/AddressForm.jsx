'use client';
import FormField from './FormField';
import { DISTRICTS } from '../../lib/member/profileOptions';

const FIELDS = [['village', 'Village'], ['postOffice', 'Post office'], ['upazila', 'Upazila']];

function AddressGroup({ group, title, values, errors, editing, onChange, action }) {
  return (
    <fieldset className="rounded-2xl border border-slate-100 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <legend className="text-sm font-bold text-slate-900">{title}</legend>
        {action}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(([key, label]) => (
          <FormField key={key} label={label} required name={`${group}.${key}`} value={values[group]?.[key]} error={errors[`${group}.${key}`]} editing={editing} onChange={(v) => onChange(group, key, v)} />
        ))}
        <FormField label="District" required name={`${group}.district`} options={DISTRICTS} value={values[group]?.district} error={errors[`${group}.district`]} editing={editing} onChange={(v) => onChange(group, 'district', v)} />
      </div>
    </fieldset>
  );
}

export default function AddressForm({ values, errors, editing, onChange, onCopyPermanent }) {
  const shared = { values, errors, editing, onChange };
  return (
    <section aria-labelledby="address-title" className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <h2 id="address-title" className="mb-5 text-base font-bold text-slate-900">Address information</h2>
      <div className="grid gap-5 xl:grid-cols-2">
        <AddressGroup group="permanent" title="Permanent address" {...shared} />
        <AddressGroup group="present" title="Present address" {...shared}
          action={editing && <button type="button" onClick={onCopyPermanent} className="text-xs font-bold text-green-800 hover:underline">Same as permanent</button>} />
      </div>
    </section>
  );
}
