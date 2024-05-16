import { z } from "zod";
import { zfd } from "zod-form-data";
import { string } from "./templates";

export const commentSchema = zfd.formData({
  text: string(1000, "comment"),
});

export type CommentSchemaT = z.infer<typeof commentSchema>;
