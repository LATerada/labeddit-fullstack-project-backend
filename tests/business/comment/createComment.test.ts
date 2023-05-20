import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto";
import { UnauthorizedError } from "../../../src/errors/UnaouthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("CreateComment tests", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Must send a message when create comment", async () => {
    const input = CreateCommentSchema.parse({
      token: "token-mock-normal",
      postId: "post-id-mock2",
      content:
        "I saw that many teachers are using it more often than their students are.",
    });

    const output = await commentBusiness.createComment(input);

    expect(output).toEqual({
      message: "Comment created",
    });
  });

  test("Must return error when token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = CreateCommentSchema.parse({
        token: "invalid-token",
        postId: "post-id-mock2",
        content: "Hello World!",
      });

      const output = await commentBusiness.createComment(input);
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
      const input = CreateCommentSchema.parse({
        token: "token-mock-normal",
        postId: "invalid-post-id",
        content: "Hello World!",
      });

      const output = await commentBusiness.createComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Invalid post id");
      }
    }
  });
});
