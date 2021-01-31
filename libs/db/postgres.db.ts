import { DBInterface } from "./DB.interface";

class PostgresDB implements DBInterface {
    constructor({  }) {

    }

    async connect() {
        return null;
    }

    async query() {
        return null;
    }
}

export { PostgresDB };
