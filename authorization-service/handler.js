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

export const basicAuthorizerFunc = async (event, ctx, cb) => {
    console.log('Event : ', JSON.stringify(event));

    if (event['type'] !== 'REQUEST') {
        cb( 'Unauthorized' );
    }

    try {
        const authorizationToken = event['headers']['Authorization'];
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const username = plainCreds[0];
        const password = plainCreds[1];

        console.log(`Username: ${username} | Password: ${password}`);

        const storedPwd = process.env[username];
        const effect = (!storedPwd || storedPwd !== password) ? 'Deny': 'Allow';
        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        cb(null, policy);

    } catch(e) {
        cb(`Unauthorized: ${e.message}`);
    }
}
