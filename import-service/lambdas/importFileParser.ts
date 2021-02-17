import AWS from "aws-sdk";
import { IMPORT_PRODUCTS_BUCKET } from "../../libs/constants/s3";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const importFileParser: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        const { Records : [ { s3: { object: { key } } } ]} = event;
        const bucketParams = {
            Bucket: IMPORT_PRODUCTS_BUCKET,
            Key: key
        };
        const s3 = new AWS.S3({ region: 'us-east-1' });
        //const readableStream = s3.getObject( bucketParams ).createReadStream();

        return successResponse( "Hi" );
    }
    catch (err) {
        return errorResponse( err );
    }
}
