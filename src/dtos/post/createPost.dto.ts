import z from "zod";

export const CreatePostSchema = z.object({
  token: z.string().min(1),
  content: z.string().min(1),
});

export type CreatePostInputDTO = z.infer<typeof CreatePostSchema>;

export type CreatePostOutputDTO = undefined;
