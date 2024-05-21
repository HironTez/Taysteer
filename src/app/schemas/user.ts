import { z } from "zod";
import { zfd } from "zod-form-data";
import { description, image, newPassword, password } from "./templates";

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

export const changePasswordSchema = zfd
  .formData({
    oldPassword: password,
    password: newPassword,
    confirmPassword: zfd.text(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchemaT = z.infer<typeof changePasswordSchema>;
