"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import type { ProfileFormData, ProfileUser } from "../lib/types";

type Props = {
  user: ProfileUser;
  isOwner: boolean;
  onSave: (
    data: ProfileFormData,
  ) => Promise<{ status: number; message: string }>;
};

export function ProfileInformation({ user, isOwner, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialData: ProfileFormData = {
    name: user.name || "",
    userName: user.userName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    age: user.age ?? null,
    address: user.address || "",
  };

  const [formData, setFormData] = useState(initialData);

  const fields: {
    label: string;
    key: keyof ProfileFormData;
    type: string;
  }[] = [
    { label: "Full name", key: "name", type: "text" },
    { label: "Username", key: "userName", type: "text" },
    { label: "Email address", key: "email", type: "email" },
    { label: "Phone number", key: "phoneNumber", type: "tel" },
    { label: "Age", key: "age", type: "number" },
    { label: "Address", key: "address", type: "text" },
  ];

  const handleChange = (key: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "age" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleEdit = () => {
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await onSave(formData);

      if (result.status !== 200) {
        setError(result.message);
        return;
      }

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  const visibleFields = isOwner
    ? fields
    : fields.filter(
        (field) => field.key === "name" || field.key === "userName",
      );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Personal information
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {isOwner
              ? "Manage your personal details."
              : "Basic information about this member."}
          </p>
        </div>

        {isOwner && !isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-300 transition hover:bg-fuchsia-500/20"
          >
            <Pencil size={15} />
            Edit profile
          </button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {visibleFields.map((field) => {
          const value = formData[field.key] ?? "";

          return (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="mb-2 block text-sm font-medium text-zinc-400"
              >
                {field.label}
              </label>

              <input
                id={field.key}
                type={field.type}
                value={value}
                min={field.key === "age" ? 1 : undefined}
                disabled={!isOwner || !isEditing || field.key === "email"}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          );
        })}
      </div>

      {isOwner && isEditing && (
        <>
          <p className="mt-4 text-xs text-zinc-500">
            Email changes require a separate verification process.
          </p>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
