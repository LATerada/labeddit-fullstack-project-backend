import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { GetCommentsSchema } from "../../../src/dtos/comment/getCommentsByPostId.dto";

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
});
