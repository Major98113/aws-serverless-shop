import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { PostgresDB } from '../../libs/db/postgres.db';
import { DBInterface } from "../../libs/db/DB.interface";

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    const { productId = '' } = event.pathParameters;
    // @ts-ignore
    const DBInstance: DBInterface = new PostgresDB( process.env );
    console.log( productId );
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
        }, null, 2),
    };
}
