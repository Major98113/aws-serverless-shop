import AWS from "aws-sdk";
import { IMPORT_PRODUCTS_BUCKET } from "../../libs/constants/s3";
import { errorResponse, successResponse, responseInterface } from "../../libs/response-helpers";

interface BucketInterface {
    CreationDate: string
    Name: string
}

interface listBucketsInterface {
    Buckets: BucketInterface[],
    Owner: {
        DisplayName: string
        ID: string
    }
}

const getBucketsList: ( s3: any ) => Promise< listBucketsInterface > = async ( s3 ) => await s3.listBuckets().promise();

const isNecessaryBucketExists = ( existingBuckets: BucketInterface[], necessaryBucket: string ): boolean => 
    Boolean( existingBuckets.find(
        ( bucket: BucketInterface ) => bucket.Name.match( necessaryBucket )
    ));

export const importProductsFile: ( event, _context ) => Promise<responseInterface> = async ( event, _context ) => {
    try {
        const { queryStringParameters: { name }} = event;
        const s3 = new AWS.S3({ region: 'us-east-1' });
        const { Buckets } = await getBucketsList( s3 );
        
        if( !isNecessaryBucketExists( Buckets, IMPORT_PRODUCTS_BUCKET ) )
            await s3.createBucket({ Bucket: IMPORT_PRODUCTS_BUCKET }).promise( );

        const bucketParams = {
            Bucket : IMPORT_PRODUCTS_BUCKET,
            Key: `uploaded/${name}`,
            Expires: 1200,
            ContentType: 'application/vnd.ms-excel'
        };

        //const response = await s3.putObject( bucketParams ).promise();
        const url = await s3.getSignedUrlPromise( 'putObject', bucketParams );

        return successResponse( url );
    } 
    catch (err) {
        return errorResponse( err );
    }
}
