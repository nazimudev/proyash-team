"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import Image from "next/image";

import Modal, {
  btnPrimary,
  btnSecondary,
  inputCls,
} from "@/components/admin/donation/Modal";

import {
  EXPENSE_TYPES,
  EXPENSE_PAYMENT_METHODS,
  EXPENSE_PAYMENT_LABELS,
} from "@/data/expenseOptions";

import { validateExpenseForm, RECEIPT_MAX_BYTES } from "@/lib/expenseUtils";

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      {children}

      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}

      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function FormBody({
  mode,
  initialValues,
  expense,
  projects = [],
  categories = [],
  loadingCategories = false,
  onCancel,
  onSubmit,
}) {
  const [v, setV] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const submitting = useRef(false);
  const fileRef = useRef(null);

  const set = (key) => (e) => {
    setV((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const a11y = (key) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `ex-${key}-err` : undefined,
  });

  // Receipt image preview
  useEffect(() => {
    const file = v.receiptFile;

    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [v.receiptFile]);

  const changeType = (e) => {
    const type = e.target.value;

    setV((prev) => ({
      ...prev,
      type,
      projectId: type === "general" ? "" : prev.projectId,
    }));

    setErrors((prev) => ({
      ...prev,
      projectId: undefined,
    }));
  };

  const pickFile = (e) => {
    const file = e.target.files?.[0] ?? null;

    setV((prev) => ({
      ...prev,
      receiptFile: file,
      receiptName: file ? file.name : prev.receiptName,
    }));

    setErrors((prev) => ({
      ...prev,
      receipt: undefined,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (submitting.current) return;

    const validationErrors = validateExpenseForm(v, categories);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    submitting.current = true;
    setSaving(true);

    try {
      await onSubmit(v);
    } catch (error) {
      console.error("Expense submission failed:", error);

      if (error.errors) {
        setErrors((prev) => ({
          ...prev,
          ...error.errors,
        }));
      }
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onCancel}
      busy={saving}
      size="lg"
      title={mode === "edit" ? `Edit Expense` : "Add Expense"}
      description={
        mode === "edit"
          ? "Update the expense information."
          : "Record a new organizational expense."
      }
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className={btnSecondary}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="expense-form"
            disabled={saving || loadingCategories}
            className={btnPrimary}
          >
            {saving ? "Saving..." : "Save Expense"}
          </button>
        </>
      }
    >
      <form
        id="expense-form"
        onSubmit={submit}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
      >
        {/* Expense title */}
        <div className="sm:col-span-2">
          <Field
            id="ex-title"
            label="Expense title"
            required
            error={errors.title}
          >
            <input
              id="ex-title"
              value={v.title}
              onChange={set("title")}
              className={inputCls}
              {...a11y("title")}
            />
          </Field>
        </div>

        {/* Expense category */}
        <Field
          id="ex-category_id"
          label="Category"
          required
          error={errors.category_id}
        >
          <select
            id="ex-category_id"
            value={v.category_id}
            onChange={set("category_id")}
            className={inputCls}
            disabled={loadingCategories || categories.length === 0}
            {...a11y("category_id")}
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : categories.length === 0
                  ? "No categories available"
                  : "Select a category"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Expense type */}
        <Field id="ex-type" label="Expense type" required>
          <select
            id="ex-type"
            value={v.type}
            onChange={changeType}
            className={inputCls}
          >
            {EXPENSE_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Project */}
        {v.type === "project" && (
          <div className="sm:col-span-2">
            <Field
              id="ex-projectId"
              label="Project"
              required
              error={errors.projectId}
            >
              <select
                id="ex-projectId"
                value={v.projectId}
                onChange={set("projectId")}
                className={inputCls}
                {...a11y("projectId")}
              >
                <option value="">Select a project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name ?? project.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Amount */}
        <Field
          id="ex-amount"
          label="Amount (৳ BDT)"
          required
          error={errors.amount}
        >
          <input
            id="ex-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={v.amount}
            onChange={set("amount")}
            placeholder="0.00"
            className={inputCls}
            {...a11y("amount")}
          />
        </Field>

        {/* Date */}
        <Field id="ex-date" label="Expense date" required error={errors.date}>
          <input
            id="ex-date"
            type="date"
            value={v.date}
            onChange={set("date")}
            className={inputCls}
            {...a11y("date")}
          />
        </Field>

        {/* Payment method */}
        <Field
          id="ex-paymentMethod"
          label="Payment method"
          required
          error={errors.paymentMethod}
        >
          <select
            id="ex-paymentMethod"
            value={v.paymentMethod}
            onChange={set("paymentMethod")}
            className={inputCls}
            {...a11y("paymentMethod")}
          >
            <option value="">Select a method</option>

            {EXPENSE_PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {EXPENSE_PAYMENT_LABELS[method]}
              </option>
            ))}
          </select>
        </Field>

        {/* Paid to */}
        <Field id="ex-paidTo" label="Paid to" hint="Optional.">
          <input
            id="ex-paidTo"
            value={v.paidTo}
            onChange={set("paidTo")}
            className={inputCls}
          />
        </Field>

        {/* Description */}
        <div className="sm:col-span-2">
          <Field
            id="ex-description"
            label="Description"
            error={errors.description}
            hint="Optional."
          >
            <textarea
              id="ex-description"
              rows={3}
              value={v.description}
              onChange={set("description")}
              className={inputCls}
              {...a11y("description")}
            />
          </Field>
        </div>

        {/* Receipt */}
        {/* <div className="sm:col-span-2">
          <Field
            id="ex-receipt"
            label="Receipt or invoice"
            error={errors.receipt}
            hint={`Optional. JPG, PNG, WebP, or PDF up to ${
              RECEIPT_MAX_BYTES / 1024 / 1024
            } MB.`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                id="ex-receipt"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={pickFile}
                className="sr-only"
                {...a11y("receipt")}
              />

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={btnSecondary}
                disabled={saving}
              >
                <Paperclip className="h-4 w-4" />
                Choose file
              </button>

              <span className="text-sm text-gray-600">
                {v.receiptName ?? "No file selected"}
              </span>
            </div>

            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Selected receipt preview"
                width={300}
                height={160}
                unoptimized
                className="mt-3 max-h-40 w-auto rounded-lg border border-gray-200 object-contain"
              />
            )}
          </Field>
        </div> */}
      </form>
    </Modal>
  );
}

export default function ExpenseFormModal({ open, mode, ...rest }) {
  if (!open) return null;

  return (
    <FormBody
      key={`${mode}-${rest.expense?.id ?? "new"}`}
      mode={mode}
      {...rest}
    />
  );
}
