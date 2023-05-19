import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto";

describe("CreatePost tests", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-normal",
      content: "Hello World!",
    });

    const output = await postBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post created",
    });
  });
});
