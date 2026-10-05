import { getCategory } from "@/action/category";
import { getListingForEdit } from "@/action/listings";
import { auth } from "@/auth";
import ListingForm from "@/components/ListingForm";

const UpdateListing = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const { id } = await params;
  const listing = await getListingForEdit(id);

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-white">
        <h1>Sorry, couldn&apos;t find your tool</h1>
      </div>
    );
  }

  if (listing.createdBy.id !== session?.user.id) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-white">
        <h1>Sorry, you can&apos;t edit this tool</h1>
      </div>
    );
  }

  const listingForForm = {
    ...listing,
    price: Number(listing.price),
    location: {
      address: listing.location?.address ?? "",
      latitude: listing.location?.latitude.toString() ?? "",
      longitude: listing.location?.longitude.toString() ?? "",
    },
  };

  const cats = await getCategory();

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-6 py-10 md:px-20">
      <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold md:text-4xl">Update your item</h1>
        <p className="text-lg text-zinc-400 md:text-xl">
          Share something with people nearby
        </p>
      </div>
      <ListingForm listing={listingForForm} categories={cats} mode="edit" />
    </div>
  );
};

export default UpdateListing;
