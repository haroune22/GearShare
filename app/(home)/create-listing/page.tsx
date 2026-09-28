"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Item name must be at least 3 characters.")
    .max(50, "Item name must be at most 50 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be at most 500 characters."),
  price: z.number().min(0, "Price cannot be negative."),
  type: z.enum(["Rent", "Borrow"]),
  category: z.string().min(1, "Please select a category."),
});

export default function CreateListing() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      type: "Rent",
      category: "",
    },
  });

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const onSubmit = (data: z.output<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-6 py-10 md:px-20">
      <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold md:text-4xl">List your item</h1>
        <p className="text-lg text-zinc-400 md:text-xl">
          Share something with people nearby
        </p>
      </div>

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
                  <FieldLabel htmlFor="create-form-type">
                    Listing type
                  </FieldLabel>
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
                    Price per week
                  </FieldLabel>

                  <Input
                    id="create-form-price"
                    type="number"
                    min="0"
                    step="0.01"
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
                  <FieldLabel htmlFor="create-form-category">
                    Category
                  </FieldLabel>
                  <select
                    {...field}
                    id="create-form-category"
                    className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white"
                  >
                    <option value="">Select a category</option>
                    <option value="tools">Tools</option>
                    <option value="cleaning-equipment">
                      Cleaning Equipment
                    </option>
                    <option value="sports">Sports</option>
                    <option value="electronics">Electronics</option>
                    <option value="garden">Garden</option>
                    <option value="events">Events</option>
                  </select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full">
              Create listing
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
