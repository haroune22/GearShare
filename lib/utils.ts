import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export const UploadButton = generateUploadButton<OurFileRouter>();

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
