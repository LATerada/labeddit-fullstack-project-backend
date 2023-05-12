import z from "zod";
import { UserModel } from "../../models/User";

export const GetUsersSchema = z.object({
  token: z.string().min(1),
  q: z.string().optional(),
});

export type GetUsersInputDTO = z.infer<typeof GetUsersSchema>;

export type GetUsersOutputDTO = UserModel[];
