import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto";

describe("LikeOrDislikePost tests", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Must return a message after like or dislike", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "post-id-mock",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });
});
