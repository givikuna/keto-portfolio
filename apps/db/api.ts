import * as fs from "fs";

import { DB } from "./interfaces/DB";

export class DB_API {
    public static fetchDB(): DB {
        return fs;
    }
}
