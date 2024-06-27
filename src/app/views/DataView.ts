import View from "../../resources/templates/View";
import { Response } from "express";

export default class DataView extends View {
    constructor(
        res: Response,
        data: {},
        entryTime: string,
        code: number = 200,
    ) {
        super(
            res,
            data,
            entryTime,
            "resolved",
            code,
            ""
        );
    }
}