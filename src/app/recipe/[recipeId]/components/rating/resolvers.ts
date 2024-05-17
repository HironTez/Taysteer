import { uploadRating } from "@/app/internal-actions/rating";
import { RatingSchemaT, ratingSchema } from "@/app/schemas/rating";
import { zodError } from "@/utils/dto";

export const resolveUploadRating = (
  data: FormData,
  recipeId: string,
  userId: string,
) => {
  const parsed = ratingSchema.safeParse(data);
  if (!parsed.success) return zodError<RatingSchemaT>(parsed.error);

  const numericValue = Number(parsed.data.value);
  return uploadRating(numericValue, recipeId, userId);
};
