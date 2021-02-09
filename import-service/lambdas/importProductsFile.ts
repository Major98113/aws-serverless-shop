import AWS from "aws-sdk";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const getAllProducts: ( event, _context ) => Promise<responseInterface> = async (event, _context) => {
    try {
        const s3 = new AWS.S3({ region: 'us-east-1' });
        
        return successResponse( "Success" );
    } 
    catch (err) {
        return errorResponse( err );
    }
}