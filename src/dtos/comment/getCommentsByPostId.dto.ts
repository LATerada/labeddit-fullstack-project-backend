import z from "zod";
import { CommentModel } from "../../models/Comment";

export const GetCommentsSchema = z.object({
  token: z.string().min(1),
  post_id: z.string().min(1),
});

export type GetCommentsInputDTO = z.infer<typeof GetCommentsSchema>;

export interface GetCommentsOutputDTO {
  comments: CommentModel[];
}
