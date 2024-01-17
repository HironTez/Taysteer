import { z } from "zod";
import { zfd } from "zod-form-data";

export const createCommentSchema = zfd.formData({
  text: zfd.text(
    z.string().max(1000, "Comment can be maximal 1000 characters long"),
  ),
});

export type CreateCommentSchemaT = z.infer<typeof createCommentSchema>;
