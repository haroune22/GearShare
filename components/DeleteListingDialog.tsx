"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "@/components/ui/toast";

const DeleteListingDialog = ({ listingId }: { listingId: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      const result = await deleteListing(listingId);

      if (!result.success) {
        toast.add({
          type: "error",
          description: result.message || "Failed to delete listing",
        });
        return;
      }

      toast.add({
        type: "success",
        description: "Listing deleted successfully",
      });
      router.push("/browse");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.add({
        description: "Something went wrong while deleting the listing",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            void handleDelete();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Continue"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteListingDialog;
