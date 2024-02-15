import z from "zod";

const userSchema = z.object({
  name: z
    .string({ required_error: "Name Must be string and minimum of 3 letter's" })
    .min(3),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required min 3 and max 8" })
    .min(3)
    .max(8),
});

const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required min 3 and max 8" })
    .min(3)
    .max(8),
});

export { userSchema, loginSchema };
