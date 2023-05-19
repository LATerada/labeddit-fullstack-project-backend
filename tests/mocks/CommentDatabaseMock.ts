import {
  CommentDB,
  COMMENT_LIKE,
  LikeDislikeCommentDB,
  PostCommentDB,
  PostCommentModel,
} from "../../src/models/Comment";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const commentsDBMock: PostCommentModel[] = [
  {
    postId: "post-id-mock",
    creatorId: "id-mock-admin",
    name: "Admin",
    commentId: "comment-id-mock",
    commentContent: "<Hello></Hello>",
    likes: 1,
    dislikes: 0,
  },
  {
    postId: "post-id-mock",
    creatorId: "id-mock-normal",
    name: "User",
    commentId: "comment-id-mock2",
    commentContent: "Haaaaaalo!.",
    likes: 0,
    dislikes: 1,
  },
];

const postCommentDBMock: PostCommentDB[] = [
  {
    post_id: "post-id-mock",
    comment_id: "comment-id-mock",
  },
  {
    post_id: "post-id-mock",
    comment_id: "comment-id-mock2",
  },
];

const likeDislikeCommentDBMock: LikeDislikeCommentDB[] = [
  {
    user_id: "id-mock-normal",
    comment_id: "comment-id-mock",
    like: 1,
  },
  {
    user_id: "id-mock-normal2",
    comment_id: "comment-id-mock",
    like: 0,
  },
];

export class CommentDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_POST_COMMENTS = "post_comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comment";

  public insertComment = async (newComment: CommentDB): Promise<void> => {};

  public insertPostComment = async (
    newPostComment: PostCommentDB
  ): Promise<void> => {};

  public findCommentsByPostId = async (
    postId: string
  ): Promise<PostCommentModel[]> => {
    const result = commentsDBMock.filter(
      (commentDBMock) => commentDBMock.postId === postId
    );
    return result as PostCommentModel[];
  };

  public findCommentsById = async (
    id: string
  ): Promise<CommentDB | undefined> => {
    const commentDB = commentsDBMock.find(
      (commentDB) => commentDB.commentId === id
    );
    return commentDB as CommentDB | undefined;
  };

  public findLikeOrDislikePost = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const result = likeDislikeCommentDBMock.find(
      (likeDislikeCommentMock) =>
        likeDislikeCommentMock.comment_id === likeOrDislike.comment_id &&
        likeDislikeCommentMock.user_id === likeOrDislike.user_id
    );

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {};

  public updateLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {};

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {};

  public editComment = async (newComment: CommentDB): Promise<void> => {};
}
