"use client";

// src/app/admin/contact-settings/page.jsx
// Place inside your existing admin layout so it inherits the sidebar, auth guard and <Toaster />.
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { refreshContactPage } from "@/actions/contactSettings";
import {
  getAdminContactSettings,
  updateContactSettings,
} from "@/services/contactSettingsApi";

const EMPTY = { phone: "", email: "", working_hours: "", map_embed_url: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts a plain embed URL or a pasted <iframe> snippet.
function extractMapSrc(value) {
  const m = value.match(/src=["']([^"']+)["']/i);
  const url = (m ? m[1] : value).trim();
  try {
    const u = new URL(url);
    const ok =
      u.protocol === "https:" &&
      /(^|\.)google\.com$/.test(u.hostname) &&
      u.pathname.startsWith("/maps/embed");
    return ok ? url : null;
  } catch {
    return null;
  }
}

export default function AdminContactSettingsPage() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminContactSettings()
      .then((res) =>
        setValues({
          phone: res.data.phone || "",
          email: res.data.email || "",
          working_hours: res.data.working_hours || "",
          map_embed_url: res.data.map_embed_url || "",
        }),
      )
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  function validate() {
    const e = {};
    if (values.phone && !/^[0-9+\-\s()]{5,30}$/.test(values.phone))
      e.phone = "Use digits, spaces, +, - and parentheses only.";
    if (values.email && !EMAIL_RE.test(values.email.trim()))
      e.email = "Enter a valid email address.";
    if (values.map_embed_url.trim() && !extractMapSrc(values.map_embed_url)) {
      e.map_embed_url =
        "Use a Google Maps embed link (Share → Embed a map → copy the src URL).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    try {
      const res = await updateContactSettings(values);
      setValues({
        phone: res.data.phone || "",
        email: res.data.email || "",
        working_hours: res.data.working_hours || "",
        map_embed_url: res.data.map_embed_url || "",
      });
      await refreshContactPage();
      toast.success(res.message || "Contact settings saved.");
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length) {
        setErrors(
          Object.fromEntries(
            Object.entries(err.errors).map(([k, v]) => [k, v[0]]),
          ),
        );
      }
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = (k) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#166534]/40 ${errors[k] ? "border-red-400" : "border-gray-300"}`;

  const mapPreview = values.map_embed_url.trim()
    ? extractMapSrc(values.map_embed_url)
    : null;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900">Contact Settings</h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">
        These details appear on the public Contact page. Leave a field empty to
        hide it.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <div>
          <label htmlFor="cs-phone" className="mb-1 block text-sm font-medium">
            Phone number
          </label>
          <input
            id="cs-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={onChange}
            className={inputCls("phone")}
          />
          {errors.phone && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cs-email" className="mb-1 block text-sm font-medium">
            Email address
          </label>
          <input
            id="cs-email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            className={inputCls("email")}
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cs-hours" className="mb-1 block text-sm font-medium">
            Working hours
          </label>
          <textarea
            id="cs-hours"
            name="working_hours"
            rows={3}
            value={values.working_hours}
            onChange={onChange}
            className={inputCls("working_hours")}
          />
          <p className="mt-1 text-xs text-gray-500">
            Line breaks are kept on the public page.
          </p>
          {errors.working_hours && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.working_hours}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cs-map" className="mb-1 block text-sm font-medium">
            Google Maps embed link
          </label>
          <textarea
            id="cs-map"
            name="map_embed_url"
            rows={3}
            value={values.map_embed_url}
            onChange={onChange}
            className={inputCls("map_embed_url")}
          />
          <p className="mt-1 text-xs text-gray-500">
            In Google Maps: open the place → Share → Embed a map → copy the
            HTML. You can paste the whole snippet or just the src link.
          </p>
          {errors.map_embed_url && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.map_embed_url}
            </p>
          )}
          {mapPreview && (
            <iframe
              title="Map preview"
              src={mapPreview}
              loading="lazy"
              className="mt-3 h-56 w-full rounded-xl border-0"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-[#14532d] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </div>
  );
}
