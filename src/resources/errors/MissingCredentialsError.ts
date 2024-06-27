import ApiError from "./ApiError";

export default class MissingCredentialsError extends ApiError {
    constructor(msg: string = "Missing requested credentials", code: number = 500) {
        super(msg, code);
    }
}