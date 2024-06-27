import ApiError from "./ApiError";

export default class NotAuthorizedError extends ApiError {
  constructor(msg: string = "Not authorized", code: number = 401) {
    super(msg, code);
  }
}
