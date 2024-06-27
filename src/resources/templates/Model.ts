import MethodNotImplementedError from "../errors/MethodNotImplementedError";
import Connection from "../utils/Connection";

export default class Model {
    protected static connection = new Connection();
    public static async find(element: any): Promise<any> {
        throw new MethodNotImplementedError();
    }
    public static async findById(id: string): Promise<any> {
        throw new MethodNotImplementedError();
    }
}