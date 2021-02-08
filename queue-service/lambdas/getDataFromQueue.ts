import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const getDataFromQueue: APIGatewayProxyHandler = async (_event, _context) => {
    console.log( _event );

    return {
        statusCode: 200,
        body: JSON.stringify( _event )
    };
}
