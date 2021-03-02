import AWS from "aws-sdk";
import CSV from 'csv-parser';
import { IMPORT_PRODUCTS_BUCKET } from "../../libs/constants/s3";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";
import AWSXRay from "aws-xray-sdk-core";

const { CATALOG_ITEMS_QUEUE } = process.env;
const sqs = AWSXRay.captureAWSClient( new AWS.SQS() );

const pendingSQSRequests: Promise<any>[] = [];

const asyncReadableStreamForTheRecords = async ( readableStream, pushData ) =>
    new Promise(
        (resolve, reject) => {
            readableStream
                .pipe( CSV() )
                .on('data', pushData )
                .on('error', reject )
                .on('end', () => {
                    console.log("End of parsed records");
                    resolve();
                })
        }
    );


const uploadRecordToSqs = async ( record ) => {
    try {
        console.log("Record data: ", record );

        pendingSQSRequests.push(
            sqs.sendMessage({
                QueueUrl: CATALOG_ITEMS_QUEUE,
                MessageBody: JSON.stringify( record )
            }).promise()
        );
    }
    catch( error ) {
        console.error( "Error while SQS data uploading", error );
    }
}

export const importFileParser: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        const { Records : [ { s3: { object: { key } } } ]} = event;
        const s3 = AWSXRay.captureAWSClient( new AWS.S3({ region: 'us-east-1' }) );
        const bucketParams = {
            Bucket: IMPORT_PRODUCTS_BUCKET,
            Key: key
        };

        await asyncReadableStreamForTheRecords(
            s3.getObject( bucketParams ).createReadStream(),
            uploadRecordToSqs
        );

        await Promise.all( pendingSQSRequests );

        return successResponse( { message: "Products successfully pushed to SQS" } );
    }
    catch (err) {
        return errorResponse( err );
    }
}
