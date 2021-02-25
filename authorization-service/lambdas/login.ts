import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const login: ( event, _context ) => Promise<responseInterface> = async ( event, _context) => {
    try {
        const { username = "", password = "" } = JSON.parse( event.body );

        const bufferedCredentials = new Buffer(`${ username }:${ password }`);
        const base64Credentials = bufferedCredentials.toString('base64' );

        return successResponse( { message: base64Credentials });
    }
    catch ( err ){
        return errorResponse( err );
    }
}
