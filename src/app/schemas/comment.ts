import { z } from "zod";
import { zfd } from "zod-form-data";
import { string } from "./templates";

export const createCommentSchema = zfd.formData({
  text: string(1000, "comment"),
});

export type CreateCommentSchemaT = z.infer<typeof createCommentSchema>;
