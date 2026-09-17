import { getListingById } from "@/action/listings";

export default async function Listing({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  console.log(listing);
  return <div>Listing</div>;
}
