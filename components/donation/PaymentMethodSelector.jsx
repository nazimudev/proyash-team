import { Smartphone, Landmark, Banknote } from "lucide-react";

const icons = { mobile: Smartphone, bank: Landmark, cash: Banknote };

/** Radio-style cards. Unavailable methods are disabled and labelled, so they can't be mistaken for working options. */
export default function PaymentMethodSelector({ methods, value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? "paymentMethod-error" : undefined}>
      <legend className="text-sm font-bold text-ink">
        Payment method <span aria-hidden="true" className="text-forest">*</span>
      </legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {methods.map((m) => {
          const Icon = icons[m.kind];
          const selected = value === m.id;
          return (
            <label
              key={m.id}
              className={`relative flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-forest ${
                m.available
                  ? selected
                    ? "cursor-pointer border-forest bg-mist"
                    : "cursor-pointer border-forest/25 bg-white hover:border-forest/60"
                  : "cursor-not-allowed border-dashed border-muted/40 bg-paper opacity-80"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={selected}
                disabled={!m.available}
                onChange={() => onChange(m.id)}
                className="sr-only"
              />
              <Icon size={20} aria-hidden="true" className={m.available ? "text-forest" : "text-muted"} />
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-bold ${m.available ? "text-ink" : "text-muted"}`}>{m.displayName}</span>
                {!m.available && <span className="block text-xs font-semibold text-muted">Not yet available</span>}
              </span>
              {selected && <span aria-hidden="true" className="size-3 rounded-full bg-forest" />}
            </label>
          );
        })}
      </div>
      {error && <p id="paymentMethod-error" className="mt-1.5 text-sm font-semibold text-[#b42318]">{error}</p>}
    </fieldset>
  );
}
