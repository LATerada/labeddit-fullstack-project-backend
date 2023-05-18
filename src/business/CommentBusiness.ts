import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  GetCommentsInputDTO,
  GetCommentsOutputDTO,
} from "../dtos/comment/getCommentsByPostId.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnaouthorizedError";
import { Comment, PostCommentDB } from "../models/Comment";
import { Post } from "../models/Post";
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

    const updatePostIdExists = new Post(
      postIdExists.id,
      postIdExists.post_content,
      postIdExists.likes,
      postIdExists.dislikes,
      postIdExists.comments,
      postIdExists.created_at,
      postIdExists.creator_id,
      postIdExists.creator_name
    );

    updatePostIdExists.addComment();

    const updatePostIdExistsDB = updatePostIdExists.toDBModel();
    await this.postDatabase.editPost(updatePostIdExistsDB);

    const output: CreateCommentOutputDTO = {
      message: "Comment created",
    };

    return output;
  };

  public getCommentsByPostId = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO> => {
    const { token, postId } = input;

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

    const postComments = await this.commentDatabase.findCommentsByPostId(
      postId
    );

    const output: GetCommentsOutputDTO = {
      comments: postComments,
    };

    return output;
  };
}
