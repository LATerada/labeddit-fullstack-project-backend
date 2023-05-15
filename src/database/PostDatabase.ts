import { PostDB, PostDBWithCreatorName } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";

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
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
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
}
