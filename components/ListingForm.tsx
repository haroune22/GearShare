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
import { LocationEdit, Trash, X } from "lucide-react";
import { useUploadThing } from "@/lib/utils";
import { createListing, updateListing } from "@/action/listings";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/generated/prisma/client";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import DeleteListingDialog from "./DeleteListingDialog";

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
    price: listing ? Number(listing.price) : 0,
    type: listing?.type ?? "Rent",
    categoryId: listing?.categoryId ?? "",
    images: listing?.images ?? [],
    location: {
      address: listing?.location?.address ?? "",
      latitude: listing?.location?.latitude?.toString() ?? "",
      longitude: listing?.location?.longitude?.toString() ?? "",
    },
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
        <FieldGroup className="gap-6">
          <div className="mb-2 space-y-1">
            <h2 className="text-xl font-semibold text-white">
              {mode === "create" ? "Create a listing" : "Edit listing"}
            </h2>
            <p className="text-sm text-zinc-400">
              {mode === "create"
                ? "Add the details of the item you want to share."
                : "Update your listing information and availability."}
            </p>
          </div>

          <div className="space-y-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">
                Basic information
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Give people enough information to understand your item.
              </p>
            </div>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-form-name">Item name</FieldLabel>
                  <Input
                    {...field}
                    className="h-11"
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
                    className="min-h-32 resize-y"
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
          </div>

          <div className="space-y-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">
                Listing details
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Choose how people can use and request your item.
              </p>
            </div>

            {mode === "edit" && (
              <Field>
                <FieldLabel htmlFor="listing-status">Availability</FieldLabel>
                <select
                  id="listing-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "ACTIVE" | "UNAVAILABLE" | "PAUSED",
                    )
                  }
                  className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-fuchsia-700 focus:ring-1 focus:ring-fuchsia-700"
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
                  <FieldLabel htmlFor="create-form-type">
                    Listing type
                  </FieldLabel>
                  <select
                    {...field}
                    id="create-form-type"
                    className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-fuchsia-700 focus:ring-1 focus:ring-fuchsia-700"
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

            <div className="grid gap-5 sm:grid-cols-2">
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
                      className="h-11 w-full"
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
                      Category
                    </FieldLabel>
                    <select
                      {...field}
                      id="create-form-categoryId"
                      className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-fuchsia-700 focus:ring-1 focus:ring-fuchsia-700"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">Photos</h3>
              <p className="mt-1 text-xs text-zinc-500">
                Add up to 5 photos. Good photos help people understand the
                condition of your item.
              </p>
            </div>
            <Field>
              <Input
                id="create-form-images"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={existingImages.length + newImages.length >= 5}
                className="h-11 cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1 file:text-xs file:font-medium file:text-zinc-200 hover:file:bg-zinc-700"
              />
              <FieldDescription>
                {existingImages.length + newImages.length}/5 images
              </FieldDescription>
            </Field>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imagePreviews.map((image, index) => (
                  <div
                    className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                    key={image}
                  >
                    <Image
                      src={image}
                      alt={`Listing image ${index + 1}`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/70 p-0 text-white backdrop-blur-sm hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        Main photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-medium text-zinc-200">
                Location details
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Address required for pickup.
              </p>
            </div>

            <Controller
              name="location.address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-form-address">Address</FieldLabel>

                  <Input
                    {...field}
                    className="h-11"
                    id="create-form-address"
                    aria-invalid={fieldState.invalid}
                    placeholder="500 route Bab Ezzouar, Alger"
                  />

                  <FieldDescription>Add the pickup address.</FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-zinc-500">OR</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="default"
                className="py-5 px-5"
                onClick={() => {
                  if (!navigator.geolocation) {
                    return;
                  }

                  navigator.geolocation.getCurrentPosition((position) => {
                    form.setValue(
                      "location.latitude",
                      position.coords.latitude.toString(),
                    );

                    form.setValue(
                      "location.longitude",
                      position.coords.longitude.toString(),
                    );
                  });
                }}
              >
                <LocationEdit />
                Add my current location
              </Button>

              <p className="text-xs text-zinc-500">
                Your browser will ask for permission to access your location.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="location.latitude"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Latitude</FieldLabel>
                    <Input {...field} readOnly />
                  </Field>
                )}
              />

              <Controller
                name="location.longitude"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Longitude</FieldLabel>
                    <Input {...field} readOnly />
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="h-12 w-full cursor-pointer bg-fuchsia-800 text-white hover:bg-fuchsia-800/80"
            >
              {form.formState.isSubmitting
                ? mode === "create"
                  ? "Creating listing..."
                  : "Updating listing..."
                : mode === "create"
                  ? "Create listing"
                  : "Update listing"}
            </Button>

            {mode === "edit" && listing && (
              <div className="rounded-xl border border-red-900/40 bg-red-950/10 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-red-300">
                    Danger zone
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Deleting this listing cannot be undone.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger
                    className="w-full cursor-pointer border-0 bg-red-900/80 py-5 text-white hover:bg-red-900"
                    render={<Button variant="outline" />}
                  >
                    <Trash className="h-4 w-4" />
                    Delete listing
                  </AlertDialogTrigger>

                  <DeleteListingDialog listingId={listing.id} />
                </AlertDialog>
              </div>
            )}
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
