import { z } from "zod";
import { zfd } from "zod-form-data";
import { description, image } from "./templates";

export const editUserSchema = zfd.formData({
  name: zfd.text(
    z.string().max(50, "Name can be maximal 50 characters long").optional(),
  ),
  description: description().optional(),
  image: image().optional(),
  username: zfd.text(
    z.string().max(20, "Username can be maximal 20 characters long"),
  ),
  email: zfd.text(
    z
      .string()
      .max(254, "Email can be maximal 254 characters long")
      .email("Invalid email"),
  ),
});

export type EditProfileSchemaT = z.infer<typeof editUserSchema>;
