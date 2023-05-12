import z from "zod";

export const LikeOrDislikePostSchema = z.object({
  token: z.string().min(1),
  idToLikeOrDislike: z.string().min(1),
  like: z.boolean(),
});

export type LikeOrDislikePostInputDTO = z.infer<typeof LikeOrDislikePostSchema>;

export interface LikeOrDislikePostOutputDTO {
  message: "Liked or Disliked";
}
