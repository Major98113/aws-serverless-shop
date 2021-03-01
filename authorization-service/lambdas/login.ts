import { diContainer } from "../../libs/di/inversify.config";
import { DBInterface } from "../../libs/db/DB.interface";
import { TYPES } from "../../libs/types";
import { UserInterface, UsersModel } from "../../libs/models/users.model";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const login: ( event, _context ) => Promise<responseInterface> = async ( event, _context) => {
    try {
        const { username = "", password = "" } = JSON.parse( event.body );

        const bufferedPassword = new Buffer(`${ password }`);
        const encodedPassword = bufferedPassword.toString('base64' );

        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const usersModelInstance = new UsersModel( DBInstance );

        await DBInstance.connect();

        const user: UserInterface | null = await usersModelInstance.getUserByCredentials( username, encodedPassword );

        if( !user )
            return errorResponse( new Error( "Unauthorized!!!" ), 401 );

        const bufferedCredentials = new Buffer(`${ username }:${ password }`);
        const encodedCredentials = bufferedCredentials.toString('base64' );

        await DBInstance.disconnect();

        return successResponse( { message: encodedCredentials });
    }
    catch ( err ){
        return errorResponse( err );
    }
}
