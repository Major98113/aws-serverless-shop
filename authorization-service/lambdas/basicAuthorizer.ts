export const basicAuthorizer = async (event, _ctx, cb) => {
    console.log('Event : ', JSON.stringify(event));

    if (event['type'] !== 'REQUEST') {
        cb( 'Unauthorized' );
    }

    try {
        const [ , encodedCredentials ] = event['headers']['Authorization'].split(' ');
        const [ username, password ] = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');

        console.log(`Username: ${username} | Password: ${password}`);

        const storedPwd = process.env[username];
        const effect = (!storedPwd || storedPwd !== password) ? 'Deny': 'Allow';
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
