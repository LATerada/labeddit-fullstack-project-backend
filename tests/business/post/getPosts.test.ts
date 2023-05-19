import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { GetPostsSchema } from "../../../src/dtos/post/getPosts.dto";

describe("GetPosts tests", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("Must return a post array", async () => {
    const input = GetPostsSchema.parse({
      token: "token-mock-normal",
    });

    const output = await postBusiness.getPosts(input);

    expect(output).toEqual({
      posts: [
        {
          id: "post-id-mock",
          postContent: "Hello World!",
          likes: 1,
          dislikes: 0,
          comments: 0,
          createdAt: expect.any(String),
          creator: {
            id: "id-mock-normal",
            name: "User",
          },
        },
        {
          id: "post-id-mock2",
          postContent: "What do you think about ChatGPT?",
          likes: 1,
          dislikes: 0,
          comments: 0,
          createdAt: expect.any(String),
          creator: {
            id: "id-mock",
            name: "User2",
          },
        },
      ],
    });
  });
});
