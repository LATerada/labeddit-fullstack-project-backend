import z from "zod";

export const CreateCommentSchema = z.object({
  token: z.string().min(1),
  post_id: z.string().min(1),
  content: z.string().min(1),
});

export type CreateCommentInputDTO = z.infer<typeof CreateCommentSchema>;

export interface CreateCommentOutputDTO {
  message: "Comment created";
}
