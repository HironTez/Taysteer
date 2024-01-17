import { z } from "zod";
import { zfd } from "zod-form-data";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

export const editUserSchema = zfd
  .formData({
    name: zfd.text(
      z.string().max(50, "Name can be maximal 50 characters long").optional(),
    ),
    description: zfd.text(
      z
        .string()
        .max(500, "Description can be maximal 500 characters long")
        .optional(),
    ),
    image: zfd.file(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          ".jpg, .jpeg, .png, svg and .webp files are accepted.",
        )
        .optional(),
    ),
    username: zfd.text(
      z
        .string()
        .max(20, "Username can be maximal 20 characters long")
        .optional(),
    ),
    email: zfd.text(
      z
        .string()
        .max(254, "Email can be maximal 254 characters long")
        .email("Invalid email")
        .optional(),
    ),
    password: zfd.text(
      z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(254, "Password can be maximal 254 characters long")
        .optional(),
    ),
    confirmPassword: zfd.text(z.string().optional()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type EditProfileSchemaT = z.infer<typeof editUserSchema>;
