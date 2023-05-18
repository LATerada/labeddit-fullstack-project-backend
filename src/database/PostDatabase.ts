import {
  LikeDislikePostDB,
  PostDB,
  PostDBWithCreatorName,
  POST_LIKE,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post";

  public insertPost = async (newPost: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPost);
  };

  public findPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result: PostDB[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    )
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.post_content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comments`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );
    return result as PostDBWithCreatorName[];
  };

  public findPostsWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.post_content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comments`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id });
    return result as PostDBWithCreatorName | undefined;
  };

  public editPost = async (newPost: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(newPost)
      .where({ id: newPost.id });
  };

  public findLikeOrDislikePost = async (
    likeDislikePostDB: LikeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POST
    ).where({
      user_id: likeDislikePostDB.user_id,
      post_id: likeDislikePostDB.post_id,
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
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
      .del()
      .where({
        user_id: likeOrDislikeDB.user_id,
        post_id: likeOrDislikeDB.post_id,
      });
  };

  public updateLikeOrDislike = async (
    likeOrDislikeDB: LikeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
      .update(likeOrDislikeDB)
      .where({
        user_id: likeOrDislikeDB.user_id,
        post_id: likeOrDislikeDB.post_id,
      });
  };

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POST
    ).insert(likeOrDislike);
  };
}
