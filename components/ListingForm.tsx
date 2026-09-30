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
import { Category } from "@/lib/generated/prisma/client";
import z from "zod";
import { ListingFormData } from "@/lib/types";
import Image from "next/image";
import { X } from "lucide-react";
import { useUploadThing } from "@/lib/utils";
import { createListing } from "@/action/listings";
import { useRouter } from "next/navigation";

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    listing?.images ?? [],
  );
  const { startUpload } = useUploadThing("imageUploader");

  const defaultValues = {
    name: listing?.name ?? "",
    description: listing?.description ?? "",
    price: listing?.price ? Number(listing.price) : 0,
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

    if (!file || imageFiles.length >= 5) return;

    const previewUrl = URL.createObjectURL(file);

    setImageFiles((previous) => [...previous, file]);
    setImagePreviews((previous) => [...previous, previewUrl]);

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const preview = imagePreviews[index];

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImageFiles((previous) => previous.filter((_, i) => i !== index));
    setImagePreviews((previous) => previous.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.output<typeof formSchema>) => {
    console.log(data);
    console.log("FILES:", imageFiles);
    if (mode === "create") {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        const uploadedFiles = await startUpload(imageFiles);

        if (!uploadedFiles) {
          throw new Error("Image upload failed");
        }

        imageUrls = uploadedFiles.map((file) => file.ufsUrl);
      }

      const newListing = await createListing(data, imageUrls);

      if (newListing) {
        router.push(`/listing/${newListing.id}`);
      }
    }
  };

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
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
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
                <FieldLabel htmlFor="create-form-category">Category</FieldLabel>
                <select
                  {...field}
                  id="create-form-category"
                  className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
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
          <Field>
            <FieldLabel htmlFor="create-form-images">Images</FieldLabel>

            <Input
              id="create-form-images"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageFiles.length >= 5}
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
          <Button type="submit" className="w-full">
            {mode === "create" ? "Create listing" : "Update listing"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
