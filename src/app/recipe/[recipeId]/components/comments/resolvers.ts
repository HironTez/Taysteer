import { createComment } from "@/app/internal-actions/comment";
import {
  CreateCommentSchemaT,
  createCommentSchema,
} from "@/app/schemas/comment";
import { zodError } from "@/utils/dto";
import { Recipe, User } from "@prisma/client";

export const resolveCreateComment = (
  data: FormData,
  recipe: Recipe,
  user: User,
) => {
  const parsed = createCommentSchema.safeParse(data);
  if (!parsed.success) return zodError<CreateCommentSchemaT>(parsed.error);

  return createComment(parsed.data.text, recipe, user);
};
