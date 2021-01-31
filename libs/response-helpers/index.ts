import { diContainer } from "../di/inversify.config";
import { LoggerInterface } from "../logger/logger.interface";
import { TYPES } from "../types";

interface responseInterface {
    statusCode: number
    headers: Object,
    body: Object
}

const defaultHeaders = {
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*'
};

const loggerInstance = diContainer.get<LoggerInterface>(TYPES.LOGGER);

const errorResponse = ( err: Error, statusCode: number = 500 ): responseInterface => {
    loggerInstance.logError(
        `Error: ${ err.message  }`
    );

    return {
        statusCode,
        headers: {
            ...defaultHeaders
        },
        body: JSON.stringify( err.message || 'Something went wrong !!!' )
    }
}

const successResponse = ( body: Object, statusCode: number = 200 ): responseInterface => {
    loggerInstance.logServiceRequest(
        `Lambda successfully invoked and finished with payload: ${ JSON.stringify( body ) } `
    );

    return {
        statusCode,
        headers: {
            ...defaultHeaders
        },
        body: JSON.stringify( body )
    }
}

export { errorResponse, successResponse, responseInterface };
