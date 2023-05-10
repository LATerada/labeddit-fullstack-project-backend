import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManeger";

export class PostBusiness {
  constructor(
    private PostDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManeger: TokenManager
  ) {}
}
