import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";

  public insertPost = async (newPost: PostDB) => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPost);
  };
}
