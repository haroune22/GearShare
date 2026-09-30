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
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    listing?.images ?? [],
  );

  const defaultValues = {
    name: listing?.name ?? "",
    description: listing?.description ?? "",
    price: listing ? Number(listing.price) : 0,
    type: listing?.type ?? "Rent",
    category: listing?.categoryId ?? "",
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

  const onSubmit = (data: z.output<typeof formSchema>) => {
    console.log(data);
  };
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file && imagePreviews.length < 5) {
      const imageFIle = URL.createObjectURL(file);
      setImagePreviews((previous) => [...previous, imageFIle]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((previous) => previous.filter((_, i) => i !== index));
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
                  onChange={(event) => {
                    field.onChange(event.target.valueAsNumber);
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
            name="category"
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
          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-form-images">Images</FieldLabel>
                <Input
                  id="create-form-images"
                  type="file"
                  onChange={handleImageChange}
                />
                <FieldDescription>
                  Upload up to 5 images of your item.
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-4 flex-wrap max-w-2xl">
              {imagePreviews.map((i, index) => (
                <div className="relative" key={i}>
                  <Image src={i} alt={i} width={300} height={300} />
                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-2 top-2 h-7 w-7 rounded-full"
                  >
                    <X />
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
