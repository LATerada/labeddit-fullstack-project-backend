import { CommentDatabase } from "../database/CommentDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManeger";

export class CommentBusiness {
  constructor(
    private CommentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManeger: TokenManager
  ) {}
}
