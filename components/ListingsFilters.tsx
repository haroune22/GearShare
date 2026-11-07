"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/generated/prisma/client";

import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const RADIUS_KM = 10;
const SEARCH_DEBOUNCE_MS = 350;
const ALL_CATEGORIES = "__all__";

const ListingsFilters = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlName = searchParams.get("name") ?? "";
  const urlCategory = searchParams.get("category") ?? ALL_CATEGORIES;

  const [searchState, setSearchState] = useState({
    urlName,
    draft: urlName,
  });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (searchState.urlName !== urlName) {
    setSearchState({ urlName, draft: urlName });
  }

  useEffect(() => {
    return () => {
      if (searchTimer.current !== null) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  const isNearMeActive = latitude !== null && longitude !== null;

  const navigateWithParams = (params: URLSearchParams) => {
    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleNameChange = (value: string) => {
    setSearchState((current) => ({
      ...current,
      draft: value,
    }));

    if (searchTimer.current !== null) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const trimmedValue = value.trim();

      if (trimmedValue) {
        params.set("name", trimmedValue);
      } else {
        params.delete("name");
      }

      params.delete("page");

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      const currentUrl = window.location.pathname + window.location.search;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleCatChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === ALL_CATEGORIES) {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    params.delete("page");
    navigateWithParams(params);
  };

  const handleNearMe = () => {
    setLocationError("");

    if (isNearMeActive) {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("latitude");
      params.delete("longitude");
      params.delete("radiusKm");
      params.delete("page");

      navigateWithParams(params);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Location services are not supported by your browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(window.location.search);

        params.set("latitude", position.coords.latitude.toFixed(5));
        params.set("longitude", position.coords.longitude.toFixed(5));
        params.set("radiusKm", String(RADIUS_KM));
        params.delete("page");

        setLocating(false);
        navigateWithParams(params);
      },
      (error) => {
        setLocating(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access was denied. Allow location access in your browser settings and try again.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Your current location is unavailable. Try again.",
            );
            break;

          case error.TIMEOUT:
            setLocationError("Getting your location took too long. Try again.");
            break;

          default:
            setLocationError("Couldn't get your location. Please try again.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  return (
    <div className="rounded-2xl border border-fuchsia-950/50 bg-zinc-900/50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

          <Input
            value={searchState.draft}
            onChange={(event) => handleNameChange(event.target.value)}
            type="text"
            className="h-14 rounded-xl border-zinc-800 bg-zinc-950 pl-12 text-white placeholder:text-zinc-500 focus-visible:ring-[#9852f2]"
            placeholder="Search tools and equipment..."
            aria-label="Search listings by name"
          />
        </div>

        <div className="flex-1">
          <Select value={urlCategory} onValueChange={handleCatChange}>
            <SelectTrigger className="w-full rounded-xl border-zinc-800 bg-zinc-950 px-4 py-7 text-white focus:ring-[#9852f2]">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-[#9852f2]" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>

            <SelectContent
              alignItemWithTrigger={false}
              className="border-zinc-800 bg-zinc-900 text-white"
            >
              <SelectItem
                value={ALL_CATEGORIES}
                className="cursor-pointer py-3 hover:text-white focus:text-white"
              >
                All Categories
              </SelectItem>

              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.slug}
                    className="cursor-pointer py-3 hover:text-white focus:text-white"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleNearMe}
          disabled={locating}
          className={`h-14 rounded-xl px-7 text-base font-semibold transition-colors ${
            isNearMeActive
              ? "bg-emerald-700 text-white hover:bg-emerald-600"
              : "bg-[#9852f2] hover:bg-[#9852f2]/80"
          }`}
        >
          {locating ? (
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-5 w-5" />
          )}

          {locating
            ? "Locating..."
            : isNearMeActive
              ? "Clear location"
              : "Near me"}
        </Button>
      </div>

      {isNearMeActive && (
        <p className="mt-3 text-sm text-emerald-400">
          Showing listings within {searchParams.get("radiusKm") ?? RADIUS_KM} km
          of your location.
        </p>
      )}

      {locationError && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {locationError}
        </p>
      )}
    </div>
  );
};

export default ListingsFilters;
