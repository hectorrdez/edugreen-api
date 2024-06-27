import ApiError from "./ApiError";

export default class InfoNotFoundError extends ApiError {
    constructor(msg: string = "Info not found", code: number = 500) {
        super(msg, code);
    }
}