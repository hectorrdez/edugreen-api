import View from "../../resources/templates/View";
import { Response } from "express";

export default class ErrorView extends View{
    constructor(
        res: Response,
        code: number,
        error: string,
        entry: string,
    ) {
        super(res, {}, entry, "error", code, error);
    }
}