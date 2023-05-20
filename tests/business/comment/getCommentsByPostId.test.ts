import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { GetCommentsSchema } from "../../../src/dtos/comment/getCommentsByPostId.dto";
import { UnauthorizedError } from "../../../src/errors/UnaouthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";

describe("GetCommentByPostId tests", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Must return comment array of specific post", async () => {
    const input = GetCommentsSchema.parse({
      token: "token-mock-admin",
      postId: "post-id-mock",
    });

    const output = await commentBusiness.getCommentsByPostId(input);

    expect(output).toEqual({
      comments: [
        {
          postId: "post-id-mock",
          creatorId: "id-mock-admin",
          name: "Admin",
          commentId: "comment-id-mock",
          commentContent: "<Hello></Hello>",
          likes: 1,
          dislikes: 0,
        },
        {
          postId: "post-id-mock",
          creatorId: "id-mock-normal",
          name: "User",
          commentId: "comment-id-mock2",
          commentContent: "Haaaaaalo!.",
          likes: 0,
          dislikes: 1,
        },
      ],
    });
  });

  test("Must return error when token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = GetCommentsSchema.parse({
        token: "invalid-token",
        postId: "post-id-mock2",
      });

      const output = await commentBusiness.getCommentsByPostId(input);
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
      const input = GetCommentsSchema.parse({
        token: "token-mock-normal",
        postId: "invalid-post-id",
      });

      const output = await commentBusiness.getCommentsByPostId(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Invalid post id");
      }
    }
  });
});
