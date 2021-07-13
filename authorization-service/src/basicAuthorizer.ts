import {diContainer} from "../../libs/di/inversify.config";
import {DBInterface} from "../../libs/db/DB.interface";
import {TYPES} from "../../libs/types";
import {UserInterface, UsersModel} from "../../libs/models/users.model";

export const basicAuthorizer = async (event, _ctx, cb) => {
    console.log('Event: ', JSON.stringify(event));

    if (event['type'] !== 'REQUEST') {
        cb( 'Unauthorized' );
    }

    try {
        const [ , encodedCredentials ] = event['headers']['Authorization'].split(' ');
        const [ username, password ] = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

        console.log(`Username: ${username} | Password: ${password}`);

        const bufferedPassword = new Buffer(`${ password }`);
        const encodedPassword = bufferedPassword.toString('base64' );

        const DBInstance = diContainer.get<DBInterface>( TYPES.DB );
        const usersModelInstance = new UsersModel( DBInstance );

        await DBInstance.connect();

        const user: UserInterface | null = await usersModelInstance.getUserByCredentials( username, encodedPassword );

        await DBInstance.disconnect();

        const effect = (!user) ? 'Deny': 'Allow';
        const policy = generatePolicy(encodedCredentials, event.methodArn, effect);

        cb( null, policy );

    }
    catch(e) {
        cb(`Unauthorized: ${e.message}`);
    }
}

const generatePolicy = (principalId, resource, effect = 'Deny') => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
};
