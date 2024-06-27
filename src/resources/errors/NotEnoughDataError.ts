import ApiError from "./ApiError";

export default class NotEnoughDataError extends ApiError {
    constructor(
        msg: string = "Not Enough Data Requested by Server",
        code: number = 406
    ) {
        super(msg, code);
    }
}