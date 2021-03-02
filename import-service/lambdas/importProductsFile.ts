import AWS from "aws-sdk";
import AWSXRay from "aws-xray-sdk-core";
import { IMPORT_PRODUCTS_BUCKET } from "../../libs/constants/s3";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

export const importProductsFile: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        // const subSegment = AWSXRay.getSegment();
        const { queryStringParameters: { name }} = event;
        const bucketParams = {
            Bucket : IMPORT_PRODUCTS_BUCKET,
            Key: `uploaded/${ name }`,
            Expires: 60,
            ContentType: 'application/vnd.ms-excel'
        };

        const s3 = AWSXRay.captureAWSClient( new AWS.S3({ region: 'us-east-1' }) );

        // subSegment.addNewSubsegment( "Getting Signed Url For Import" );
        // subSegment.addAnnotation( "bucket", bucketParams.Bucket );
        // subSegment.addAnnotation( "bucket_key", bucketParams.Key );

        const url = await s3.getSignedUrlPromise( 'putObject', bucketParams );

        // subSegment.close();
        return successResponse( url );
    } 
    catch (err) {
        return errorResponse( err );
    }
}
