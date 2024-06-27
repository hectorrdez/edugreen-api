import ApiError from "./ApiError";

export default class RouteNotDeclaredError extends ApiError {
    constructor(msg: string = "Route not declared", code: number = 500) {
        super(msg, code);
    }
}