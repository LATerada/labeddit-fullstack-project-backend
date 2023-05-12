import z from "zod";

export const SignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupInputDTO = z.infer<typeof SignupSchema>;

export interface SignupOutputDTO {
  token: string;
}
