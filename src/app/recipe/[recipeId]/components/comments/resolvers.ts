import { createComment, editComment } from "@/app/internal-actions/comment";
import { CommentSchemaT, commentSchema } from "@/app/schemas/comment";
import { zodError } from "@/utils/dto";

export const resolveCreateComment = (
  data: FormData,
  recipeId: string,
  userId: string,
) => {
  const parsed = commentSchema.safeParse(data);
  if (!parsed.success) return zodError<CommentSchemaT>(parsed.error);

  return createComment(parsed.data.text, recipeId, userId);
};

export const resolveEditComment = (data: FormData, id: string) => {
  const parsed = commentSchema.safeParse(data);
  if (!parsed.success) return zodError<CommentSchemaT>(parsed.error);

  return editComment(id, parsed.data.text);
};
