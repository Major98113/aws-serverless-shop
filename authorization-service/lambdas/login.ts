import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const login: ( event, _context ) => Promise<responseInterface> = async ( event, _context) => {
    try {
        const { username = "", password = "" } = JSON.parse( event.body );

        const bufferedCredentials = new Buffer(`${ username }:${ password }`);
        const encodedCredentials = bufferedCredentials.toString('base64' );

        return successResponse( { message: encodedCredentials });
    }
    catch ( err ){
        return errorResponse( err );
    }
}
