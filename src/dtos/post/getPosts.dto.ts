import z from "zod";
import { PostModel } from "../../models/Post";

export const GetPostsSchema = z.object({
  token: z.string().min(1),
});

export type GetPostsInputDTO = z.infer<typeof GetPostsSchema>;

export interface GetPostsOutputDTO {
  posts: PostModel[];
}
