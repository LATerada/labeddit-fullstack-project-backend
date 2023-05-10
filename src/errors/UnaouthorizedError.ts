import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}
