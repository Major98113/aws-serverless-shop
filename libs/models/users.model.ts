import { DBInterface } from "../db/DB.interface";
import { diContainer } from "../di/inversify.config";
import { LoggerInterface } from "../logger/logger.interface";
import { TYPES } from "../types";

interface UserInterface {
    id?: string,
    username: string,
    password: string
}

interface UsersModelInterface {
    getUserByCredentials( username: string, password: string ): Promise<null | UserInterface>
}

class UsersModel implements UsersModelInterface{
    private readonly DB: DBInterface;
    private readonly logger: LoggerInterface;

    constructor( DB: DBInterface) {
        this.DB = DB;
        this.logger = diContainer.get<LoggerInterface>( TYPES.LOGGER );
    }

    async getUserByCredentials(username: string, password: string) {
        try {
            const response = await this.DB.query(`
                SELECT user_id, username 
                    FROM users
                        WHERE username = $1 
                            AND password = $2;`, [ username, password ]
            );

            if( response?.rows?.length ) {
                const { rows: [ user ] } = response;

                return user;
            }

            return null;

        }
        catch( error ) {
            this.logger.logError( `Method UsersModel::getUserByCredentials. Error: ${ error }` );
            throw new Error( error  );
        }
    }
}

export { UsersModel, UserInterface };
