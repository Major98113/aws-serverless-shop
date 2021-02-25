import { DB_CONFIG } from "../libs/constants/dbConfig";

const serverlessConfiguration = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [ 'serverless-webpack', 'serverless-offline' ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      ...DB_CONFIG
    },
    lambdaHashingVersion: '20201221',
  },
  package: {
    include: [ '../libs/*' ]
  },
  functions: {
    basicAuthorizerFunc: {
      handler: 'handler.basicAuthorizer'
    },
    login: {
      handler: 'handler.login',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            path: "login",
            method: "post",
            cors: true
          }
        }
      ]
    }
  },
  resources: {
    Outputs: {
      AuthorizationServiceLambda: {
        Export: {
          Name: "AuthorizationServiceLambdaARN"
        },
        Value: {
          "Fn::GetAtt" : "BasicAuthorizerFuncLambdaFunction.Arn"
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
