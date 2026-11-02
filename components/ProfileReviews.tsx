import { MessageSquare, Star } from "lucide-react";
import type { ProfileReview } from "../lib/types";

type Props = {
  reviews: ProfileReview[];
};

export function ProfileReviews({ reviews }: Props) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Reviews</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Feedback from other GearShare members.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 py-12 text-center">
          <MessageSquare size={35} className="text-zinc-600" />

          <h3 className="mt-4 font-medium text-white">No reviews yet</h3>

          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Reviews received from other members will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-7 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div>
              <p className="text-4xl font-bold text-white">
                {averageRating.toFixed(1)}
              </p>

              <p className="mt-1 text-xs text-zinc-500">Average rating</p>
            </div>

            <div className="border-l border-zinc-800 pl-5">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={17}
                    className={
                      index < Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-700"
                    }
                  />
                ))}
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                Based on {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {review.reviewer.name || review.reviewer.userName}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      @{review.reviewer.userName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm font-medium text-white">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                    {review.comment}
                  </p>
                )}

                <p className="mt-4 text-xs text-zinc-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
