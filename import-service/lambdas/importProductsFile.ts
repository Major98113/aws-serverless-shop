import AWS from "aws-sdk";
import { IMPORT_PRODUCTS_BUCKET } from "../../libs/constants/s3";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const importProductsFile: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        const { queryStringParameters: { name }} = event;
        const bucketParams = {
            Bucket : IMPORT_PRODUCTS_BUCKET,
            Key: `uploaded/${ name }`,
            Expires: 60,
            ContentType: 'application/vnd.ms-excel'
        };
        const s3 = new AWS.S3({ region: 'us-east-1' });
        const url = await s3.getSignedUrlPromise( 'putObject', bucketParams );

        return successResponse( url );
    } 
    catch (err) {
        return errorResponse( err );
    }
}
