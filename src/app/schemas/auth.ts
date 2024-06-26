import { z } from "zod";
import { zfd } from "zod-form-data";
import { newPassword, password } from "./templates";

export const loginSchema = zfd.formData({
  email: zfd.text(
    z
      .string()
      .max(254, "Email can be maximal 254 characters long")
      .email("Invalid email"),
  ),
});

export type LogInSchemaT = z.infer<typeof loginSchema>;

export const signInSchema = zfd.formData({
  password,
});

export type SignInSchemaT = z.infer<typeof signInSchema>;

export const signUpSchema = zfd
  .formData({
    password: newPassword,
    confirmPassword: zfd.text(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpSchemaT = z.infer<typeof signUpSchema>;
