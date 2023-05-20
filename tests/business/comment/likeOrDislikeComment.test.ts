import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto";
import { UnauthorizedError } from "../../../src/errors/UnaouthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("LikeOrDislikeComment tests", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Must return a message after like if never liked or disliked", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "comment-id-mock2",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after dislike if never liked or disliked", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "comment-id-mock2",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after like if already liked", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal",
      idToLikeOrDislike: "comment-id-mock",
      like: true,
    });
    
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after dislike if already liked", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal",
      idToLikeOrDislike: "comment-id-mock",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after dislike if already disliked", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal2",
      idToLikeOrDislike: "comment-id-mock",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return a message after like if already disliked", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal2",
      idToLikeOrDislike: "comment-id-mock",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Liked or Disliked",
    });
  });

  test("Must return error when token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "invalid-token",
        idToLikeOrDislike: "comment-id-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Invalid token");
      }
    }
  });

  test("Must return error when comment id doesn't exist", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "token-mock-normal",
        idToLikeOrDislike: "invalid-post-id",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Comment not found");
      }
    }
  });


  test("Must return error when comment is liked by creator", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "token-mock-admin",
        idToLikeOrDislike: "comment-id-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(  "The comment creator can not give likes or dislikes");
      }
    }
  });


});
