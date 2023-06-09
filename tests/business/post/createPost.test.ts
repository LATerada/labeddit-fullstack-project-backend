import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnaouthorizedError";

describe("CreatePost tests", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Must send a message when create post", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-normal",
      content: "Hello World!",
    });

    const output = await postBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post created",
    });
  });

  test("Must return error when token is invalid", async () => {
    expect.assertions(2);
    try {
      const input = CreatePostSchema.parse({
        token: "invalid-token",
        content: "Hello World!",
      });

      const output = await postBusiness.createPost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Invalid token");
      }
    }
  });
});
