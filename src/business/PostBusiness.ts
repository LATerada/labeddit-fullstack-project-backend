import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnaouthorizedError";
import { LikeDislikePostDB, Post, POST_LIKE } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManeger";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManeger: TokenManager
  ) {}

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { token, content } = input;

    const payload = this.tokenManeger.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }
    const id = this.idGenerator.generate();

    const newPost = new Post(
      id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const newPostDB = newPost.toDBModel();

    await this.postDatabase.insertPost(newPostDB);

    const output: CreatePostOutputDTO = {
      message: "Post created",
    };

    return output;
  };

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManeger.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postsDDWithCreatorName =
      await this.postDatabase.findPostsWithCreatorName();

    const posts = postsDDWithCreatorName.map((postDDWithCreatorName) => {
      const post = new Post(
        postDDWithCreatorName.id,
        postDDWithCreatorName.post_content,
        postDDWithCreatorName.likes,
        postDDWithCreatorName.dislikes,
        postDDWithCreatorName.comments,
        postDDWithCreatorName.created_at,
        postDDWithCreatorName.updated_at,
        postDDWithCreatorName.creator_id,
        postDDWithCreatorName.creator_name
      );
      return post.toBusinessModel();
    });

    const output: GetPostsOutputDTO = {
      posts,
    };

    return output;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { token, idToLikeOrDislike, like } = input;

    const payload = this.tokenManeger.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postDDWithCreatorName =
      await this.postDatabase.findPostsWithCreatorNameById(idToLikeOrDislike);

    if (!postDDWithCreatorName) {
      throw new NotFoundError("Post not found");
    }

    const post = new Post(
      postDDWithCreatorName.id,
      postDDWithCreatorName.post_content,
      postDDWithCreatorName.likes,
      postDDWithCreatorName.dislikes,
      postDDWithCreatorName.comments,
      postDDWithCreatorName.created_at,
      postDDWithCreatorName.updated_at,
      postDDWithCreatorName.creator_id,
      postDDWithCreatorName.creator_name
    );

    const likeSQLlite = like ? 1 : 0;

    const likeOrDislikeDB: LikeDislikePostDB = {
      user_id: payload.id,
      post_id: postDDWithCreatorName.id,
      like: likeSQLlite,
    };

    const likeOrDislikePostExists =
      await this.postDatabase.findLikeOrDislikePost(likeOrDislikeDB);

    if (post.getCreatorId() !== payload.id) {
      throw new ForbiddenError(
        "The post creator can not give likes or dislikes"
      );
    }

    if (likeOrDislikePostExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.insertLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeOrDislikePostExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.insertLikeOrDislike(likeOrDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeOrDislike(likeOrDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.editPost(updatedPostDB);

    const output: LikeOrDislikePostOutputDTO = {
      message: "Liked or Disliked",
    };

    return output;
  };
}
