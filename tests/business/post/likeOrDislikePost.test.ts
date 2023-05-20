import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto";
import { UnauthorizedError } from "../../../src/errors/UnaouthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

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

  test("Must return error when token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikePostSchema.parse({
        token: "invalid-token",
        idToLikeOrDislike: "post-id-mock",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Invalid token");
      }
    }
  });

  test("Must return error when post id doesn't exist", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikePostSchema.parse({
        token: "token-mock-normal2",
        idToLikeOrDislike: "invalid-post-id",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Post not found");
      }
    }
  });

  test("Must return error when post is liked by creator", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikePostSchema.parse({
        token: "token-mock-normal",
        idToLikeOrDislike: "post-id-mock",
        like: true,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("The post creator can not give likes or dislikes");
      }
    }
  });


});
