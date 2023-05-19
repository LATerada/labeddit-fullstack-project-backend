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

  test("Must return a message after like if never liked or disliked", async () => {
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

  test("Must return a message after dislike if never liked or disliked", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "post-id-mock",
      like: false,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after like if already liked", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-normal",
      idToLikeOrDislike: "post-id-mock2",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });


  test("Must return a message after dislike if already liked", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-normal",
      idToLikeOrDislike: "post-id-mock2",
      like: false,
    });

    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after dislike if already disliked", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-normal2",
      idToLikeOrDislike: "post-id-mock",
      like: false,
    });

    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after like if already disliked", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-normal2",
      idToLikeOrDislike: "post-id-mock",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });
});
