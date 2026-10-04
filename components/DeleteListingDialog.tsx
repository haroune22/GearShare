import { deleteListing } from "@/action/listings";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BaseUIEvent } from "@base-ui/react";
import { redirect } from "next/navigation";
import { MouseEvent } from "react";

const DeleteListingDialog = ({ listingId }: { listingId: string }) => {
  const handleDelete = async (
    e: BaseUIEvent<MouseEvent<HTMLButtonElement, globalThis.MouseEvent>>,
  ) => {
    e.preventDefault();
    const deletedListing = await deleteListing(listingId);
    if (deletedListing.success) {
      redirect("/browse");
    }
  };
  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this listing?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDelete(e)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
};

export default DeleteListingDialog;
