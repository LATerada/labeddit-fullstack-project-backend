import z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInputDTO = z.infer<typeof LoginSchema>;

export interface LoginOutputDTO {
  token: string;
}
