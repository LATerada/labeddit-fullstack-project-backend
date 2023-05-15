import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import { UnauthorizedError } from "../errors/UnaouthorizedError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManeger";

export class PostBusiness {
  constructor(
    private PostDatabase: PostDatabase,
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

    await this.PostDatabase.insertPost(newPostDB);

    const output: CreatePostOutputDTO = {
      message: "Post created",
    };

    return output;
  };
}
