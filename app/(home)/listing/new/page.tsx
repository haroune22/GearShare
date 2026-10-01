import { getCategory } from "@/action/category";
import ListingForm from "@/components/ListingForm";

const CreateListing = async () => {
  const cats = await getCategory();
  return (
    <div className="flex min-h-screen w-full flex-col items-center px-6 py-10 md:px-20">
      <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold md:text-4xl">List your item</h1>
        <p className="text-lg text-zinc-400 md:text-xl">
          Share something with people nearby
        </p>
      </div>
      <ListingForm categories={cats} mode="create" />
    </div>
  );
};

export default CreateListing;
