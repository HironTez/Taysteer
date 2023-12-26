import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginSchema = zfd.formData({
  email: zfd.text(z.string().email("Invalid email")),
});

export type LogInSchemaT = z.infer<typeof loginSchema>;

export const signInSchema = zfd.formData({
  password: zfd.text(),
});

export type SignInSchemaT = z.infer<typeof signInSchema>;

export const signUpSchema = zfd
  .formData({
    password: zfd.text(
      z.string().min(8, "Password must be at least 8 characters long"),
    ),
    confirmPassword: zfd.text(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpSchemaT = z.infer<typeof signUpSchema>;
