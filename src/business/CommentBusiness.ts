import { NotBeforeError } from "jsonwebtoken";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnaouthorizedError";
import { Comment, PostCommentDB } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManeger";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManeger: TokenManager
  ) {}

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { token, postId, content } = input;

    const payload = this.tokenManeger.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    const postIdExists = await this.postDatabase.findPostsWithCreatorNameById(
      postId
    );

    if (!postIdExists) {
      throw new NotFoundError("Invalid post id");
    }

    const id = this.idGenerator.generate();

    const newComment = new Comment(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const newCommentDB = newComment.toDBModel();

    await this.commentDatabase.insertComment(newCommentDB);

    const newPostCommentDB: PostCommentDB = {
      post_id: postId,
      comment_id: id,
    };

    await this.commentDatabase.insertPostComment(newPostCommentDB);

    const output: CreateCommentOutputDTO = {
      message: "Comment created",
    };

    return output;
  };
}
