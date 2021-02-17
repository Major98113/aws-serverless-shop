import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const importFileParser: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        console.log( "Event", JSON.stringify( event ) );
        return successResponse( "Hi" );
    }
    catch (err) {
        return errorResponse( err );
    }
}
