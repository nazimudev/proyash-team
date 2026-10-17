"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass } from "@/components/ui/FormField";

/** Password field with a show/hide control. `aria` carries id / aria-invalid / aria-describedby from fieldAria(). */
export default function PasswordInput({ aria, value, onChange, invalid, autoComplete = "new-password", placeholder }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        {...aria}
        type={shown ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass(invalid)} pr-14`}
      />
      <button
        type="button"
        aria-pressed={shown}
        aria-label={shown ? "Hide password" : "Show password"}
        onClick={() => setShown((s) => !s)}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-lg text-muted hover:text-forest"
      >
        {shown ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
