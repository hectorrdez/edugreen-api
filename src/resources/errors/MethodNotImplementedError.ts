import ApiError from "./ApiError";

export default class MethodNotImplementedError extends ApiError {
    constructor(msg: string = "Method not implemented", code: number = 500) {
        super(msg, code);
    }
}