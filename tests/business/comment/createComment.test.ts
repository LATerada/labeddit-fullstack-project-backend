import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto";

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
      content: "I saw that many teachers are using it more often than their students are.",
    });

    const output = await commentBusiness.createComment(input);

    expect(output).toEqual({
      message: "Comment created",
    });
  });
});
