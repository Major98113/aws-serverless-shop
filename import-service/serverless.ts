import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '10',
      DB_HOST: 'DB_HOST',
      DB_PORT: 'DB_PORT',
      DB_NAME: 'DB_NAME',
      DB_USERNAME: 'DB_USERNAME',
      DB_PASSWORD: 'DB_PASSWORD'
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [ "s3:*" ],
        Resource: [ "arn:aws:s3:::*" ]
      }
    ],
  },
  package: {
    include: [ '../libs/*' ]
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
