"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGalleryProps = {
  images: string[];
  name: string;
};

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const hasImages = images.length > 0;

  if (!hasImages) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center rounded-2xl border border-zinc-800 bg-linear-to-br from-fuchsia-950 via-zinc-900 to-zinc-950">
        <p className="text-sm text-zinc-500">No images available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <Image
          src={images[selectedImage]}
          alt={`${name} image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-4 flex gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`relative h-20 w-24 overflow-hidden rounded-lg border ${
              selectedImage === index ? "border-fuchsia-500" : "border-zinc-800"
            }`}
          >
            <Image
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
