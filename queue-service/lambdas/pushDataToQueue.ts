import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import 'source-map-support/register';

export const pushDataToQueue: APIGatewayProxyHandler = async (_event, _context) => {
    const { THE_QUEUE_URL } = process.env;
    const sqs = new AWS.SQS();

    const response = await sqs.sendMessage({
        QueueUrl: THE_QUEUE_URL,
        MessageBody: "Test message"
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify( response )
    };
}
