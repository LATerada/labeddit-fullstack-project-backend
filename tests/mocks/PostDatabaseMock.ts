import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  LikeDislikePostDB,
  PostDB,
  PostDBWithCreatorName,
  PostModel,
  POST_LIKE,
} from "../../src/models/Post";

const postModelMock: PostModel[] = [
  {
    id: "post-id-mock",
    postContent: "Hello World!",
    likes: 1,
    dislikes: 0,
    comments: 2,
    createdAt: "2023-05-19T11:55:00.924Z",
    creator: {
      id: "990b55b5-5b6f-4f55-a7b7-db307dcbe15a",
      name: "User1",
    },
  },
  {
    id: "post-id-mock2",
    postContent: "What do you think about ChatGPT?",
    likes: 1,
    dislikes: 0,
    comments: 1,
    createdAt: "2023-05-19T11:59:43.426Z",
    creator: {
      id: "fd24e8bc-dedb-48ed-a3b7-c65828fc8ff5",
      name: "User2",
    },
  },
];

const postDBMock: PostDBWithCreatorName[] = [
  {
    id: "post-id-mock",
    creator_id: "id-mock-normal",
    post_content: "Hello World!",
    likes: 1,
    dislikes: 0,
    comments: 0,
    created_at: expect.any(String),
    creator_name: "User",
  },
  {
    id: "post-id-mock2",
    creator_id: "id-mock",
    post_content: "What do you think about ChatGPT?",
    likes: 1,
    dislikes: 0,
    comments: 0,
    created_at: expect.any(String),
    creator_name: "User2",
  },
];
const likeDislikePostDBMock: LikeDislikePostDB[] = [
  {
    user_id: "id-mock-normal",
    post_id: "post-id-mock2",
    like: 1,
  },
  {
    user_id: "id-mock",
    post_id: "post-id-mock",
    like: 1,
  },
];

export class PostDatabaseMock extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post";

  public insertPost = async (newPost: PostDB): Promise<void> => {};

  public findPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result = postDBMock;
    return result as PostDBWithCreatorName[];
  };

  public findPostsWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const result = postModelMock.find((post) => post.id === id);
    return result as PostDBWithCreatorName | undefined;
  };

  public editPost = async (newPost: PostDB): Promise<void> => {};

  public findLikeOrDislikePost = async (
    likeDislikePostDB: LikeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const result = likeDislikePostDBMock.find((likeDislikeMock) => {
      likeDislikeMock.user_id === likeDislikePostDB.user_id &&
        likeDislikeMock.post_id === likeDislikePostDB.post_id;
    });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeOrDislike = async (
    likeOrDislikeDB: LikeDislikePostDB
  ): Promise<void> => {};

  public updateLikeOrDislike = async (
    likeOrDislikeDB: LikeDislikePostDB
  ): Promise<void> => {};

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<void> => {};
}
