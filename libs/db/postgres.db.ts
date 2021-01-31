import { Client } from 'pg';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { DBInterface } from "./DB.interface";

@injectable()
class PostgresDB implements DBInterface {
    private readonly client: Client;
    constructor({ DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD }) {
        const dbOptions = {
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 5000
        };

        this.client = new Client(dbOptions);
    }

    async connect() {
        try {
            await this.client.connect();
        }
        catch ( err ){

        }
    }

    async query( queryStr: string ) {
        try {
            const response: any = await this.client.query( queryStr );
            return response;
        }
        catch ( err) {

        }
    }
}

export { PostgresDB };
