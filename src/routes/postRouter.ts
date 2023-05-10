import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManeger";

export const postRouter = express.Router();

const postController = new PostController(
  new PostBusiness(new PostDatabase(), new IdGenerator(), new TokenManager())
);
