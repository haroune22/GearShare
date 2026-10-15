"use client";

import dynamic from "next/dynamic";

const ComponentA = dynamic(
  () => import("./ListingMap").then((mod) => mod.ListingMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 w-full animate-pulse rounded-xl bg-zinc-800" />
    ),
  },
);

type ListingMapProps = {
  address: string;
  latitude: number;
  longitude: number;
};

export const ListingMapWrapper = ({
  address,
  latitude,
  longitude,
}: ListingMapProps) => {
  return (
    <ComponentA address={address} latitude={latitude} longitude={longitude} />
  );
};

export default ListingMapWrapper;
