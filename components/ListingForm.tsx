"use client";

import React, { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ListingFormData } from "@/lib/types";
import Image from "next/image";
import { Trash, X } from "lucide-react";
import { useUploadThing } from "@/lib/utils";
import { createListing, updateListing } from "@/action/listings";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/generated/prisma/client";

type ListingFormProps = {
  mode: "create" | "edit";
  listing?: ListingFormData;
  categories: Category[];
};

export default function ListingForm({
  categories,
  mode,
  listing,
}: ListingFormProps) {
  const router = useRouter();

  const [existingImages, setExistingImages] = useState<string[]>(
    listing?.images ?? [],
  );

  const [newImages, setNewImages] = useState<{ file: File; blob: string }[]>(
    [],
  );

  const [status, setStatus] = useState<"ACTIVE" | "UNAVAILABLE" | "PAUSED">(
    listing?.status ?? "ACTIVE",
  );

  const { startUpload } = useUploadThing("imageUploader");

  const defaultValues = {
    name: listing?.name ?? "",
    description: listing?.description ?? "",
    price: listing ? Number(listing.price) : undefined,
    type: listing?.type ?? "Rent",
    categoryId: listing?.categoryId ?? "",
    images: listing?.images ?? [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || existingImages.length + newImages.length >= 5) return;

    const previewUrl = URL.createObjectURL(file);

    setNewImages((previous) => [
      ...previous,
      {
        file,
        blob: previewUrl,
      },
    ]);

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const existingCount = existingImages.length;

    if (index < existingCount) {
      setExistingImages((previous) => previous.filter((_, i) => i !== index));
      return;
    }

    const newIndex = index - existingCount;
    const image = newImages[newIndex];

    if (image) {
      URL.revokeObjectURL(image.blob);

      setNewImages((previous) => previous.filter((_, i) => i !== newIndex));
    }
  };

  const onSubmit = async (data: z.output<typeof formSchema>) => {
    if (mode === "create") {
      const newFiles = newImages.map((image) => image.file);

      let imageUrls: string[] = [];

      if (newFiles.length > 0) {
        const uploadedFiles = await startUpload(newFiles);

        if (!uploadedFiles) {
          throw new Error("Image upload failed");
        }
        imageUrls = uploadedFiles.map((file) => file.ufsUrl);
      }

      const newListing = await createListing(data, imageUrls);

      if (newListing) {
        router.push(`/listing/${newListing.id}`);
      }
      return;
    }

    if (mode === "edit" && listing) {
      const newFiles = newImages.map((image) => image.file);

      let uploadedUrls: string[] = [];

      if (newFiles.length > 0) {
        const uploadedFiles = await startUpload(newFiles);

        if (!uploadedFiles) {
          throw new Error("Image upload failed");
        }

        uploadedUrls = uploadedFiles.map((file) => file.ufsUrl);
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      const updatedListing = await updateListing(
        listing.id,
        data,
        finalImages,
        status,
      );

      if (updatedListing) {
        router.push(`/listing/${updatedListing.id}`);
      }
    }
  };

  const imagePreviews = [
    ...existingImages,
    ...newImages.map((image) => image.blob),
  ];

  return (
    <div className="w-full max-w-2xl">
      <form id="create-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-form-name">Item name</FieldLabel>
                <Input
                  {...field}
                  className="h-12"
                  id="create-form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Karcher Pressure Washer"
                />
                <FieldDescription>
                  Give your item a clear and recognizable name.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-form-description">
                  Description
                </FieldLabel>

                <Textarea
                  {...field}
                  id="create-form-description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Describe your item, its condition, and what people can use it for..."
                  className="min-h-32"
                />
                <FieldDescription>
                  Tell renters what they should know before requesting it.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {mode === "edit" && (
            <Field>
              <FieldLabel htmlFor="listing-status">Status</FieldLabel>

              <select
                id="listing-status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "ACTIVE" | "UNAVAILABLE" | "PAUSED",
                  )
                }
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="UNAVAILABLE">Unavailable</option>
                <option value="PAUSED">Paused</option>
              </select>
            </Field>
          )}

          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-form-type">Listing type</FieldLabel>
                <select
                  {...field}
                  id="create-form-type"
                  className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
                >
                  <option value="Rent">Rent</option>
                  <option value="Borrow">Borrow</option>
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-form-price">
                  Price per day
                </FieldLabel>

                <Input
                  id="create-form-price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="max-w-30"
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? "" : Number(value));
                  }}
                  aria-invalid={fieldState.invalid}
                  placeholder="30"
                  disabled={selectedType === "Borrow"}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-form-categoryId">
                  categoryId
                </FieldLabel>
                <select
                  {...field}
                  id="create-form-categoryId"
                  className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
                >
                  {categories.map((categoryId) => (
                    <option key={categoryId.id} value={categoryId.id}>
                      {categoryId.name}
                    </option>
                  ))}
                </select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <FieldLabel htmlFor="create-form-images">Images</FieldLabel>

            <Input
              id="create-form-images"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={existingImages.length + newImages.length >= 5}
            />

            <FieldDescription>
              Add up to 5 images of your item. You can remove them before
              creating the listing.
            </FieldDescription>
          </Field>

          {imagePreviews.length > 0 && (
            <div className="flex max-w-2xl flex-wrap gap-4">
              {imagePreviews.map((image, index) => (
                <div
                  className="relative overflow-hidden rounded-lg"
                  key={image}
                >
                  <Image
                    src={image}
                    alt={`Listing image ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-48 w-48 object-cover"
                  />

                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-2 top-2 h-7 w-7 rounded-full p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer bg-fuchsia-800 py-5 hover:bg-fuchsia-800/80"
            >
              {form.formState.isSubmitting
                ? mode === "create"
                  ? "Creating listing..."
                  : "Updating listing..."
                : mode === "create"
                  ? "Create listing"
                  : "Update listing"}
            </Button>

            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                disabled={form.formState.isSubmitting}
                className="w-full cursor-pointer py-5"
              >
                <Trash />
                Delete listing
              </Button>
            )}
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
