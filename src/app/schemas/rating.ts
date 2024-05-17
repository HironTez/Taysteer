import { z } from "zod";
import { zfd } from "zod-form-data";

export const ratingSchema = zfd.formData({
  value: zfd.text(
    z
      .string()
      .length(1, "Could not publish rating")
      .refine(
        (value) => value.match(/^[1-5]$/),
        `Rating value should be in range from 1 to 5`,
      ),
  ),
});

export type RatingSchemaT = z.infer<typeof ratingSchema>;
