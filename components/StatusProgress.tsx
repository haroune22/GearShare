import React from "react";
import { Progress, ProgressLabel, ProgressValue } from "./ui/progress";
import { BookingStatus } from "@/lib/generated/prisma/client";

type StatusProgressProps = {
  bookingStatus: BookingStatus;
};
export const StatusProgress = ({ bookingStatus }: StatusProgressProps) => {
  return (
    <div className="flex items-center justify-center py-10">
      <Progress value={56} className="w-full max-w-sm">
        <ProgressLabel>Upload progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  );
};
