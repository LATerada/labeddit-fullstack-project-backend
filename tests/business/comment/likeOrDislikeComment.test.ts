import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto";

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
      idToLikeOrDislike: "comment-id-mock",
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
      idToLikeOrDislike: "comment-id-mock",
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
});
