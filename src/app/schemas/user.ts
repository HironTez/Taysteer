import { z } from "zod";
import { zfd } from "zod-form-data";

// TODO: limit username characters & other data length
export const editUserSchema = zfd
  .formData({
    name: zfd.text(z.string().optional()),
    description: zfd.text(z.string().optional()),
    image: zfd.file(z.instanceof(File).optional()),
    username: zfd.text(z.string().optional()),
    email: zfd.text(z.string().email("Invalid email").optional()),
    password: zfd.text(
      z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .optional(),
    ),
    confirmPassword: zfd.text(z.string().optional()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type EditProfileSchemaT = z.infer<typeof editUserSchema>;
