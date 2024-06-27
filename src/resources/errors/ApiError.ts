export default class ApiError extends Error {
    constructor(
        private msg: string = "",
        private code: number = 500,
    ) {
        super(`ERROR ${code}: ${msg}`);
    }

    public getMessage(): string {
        return this.msg;
    }
    public getCode(): number {
        return this.code;
    }
}