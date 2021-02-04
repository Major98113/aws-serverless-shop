import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'queue-service',
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
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      THE_QUEUE_URL: {
        Ref: "FirstQueue"
      }
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action:"sqs:*",
        Resource: [
          {
            "Fn::GetAtt" : [ "FirstQueue", "Arn" ]
          }
        ]
      }
    ]
  },
  functions: {
    hello: {
      handler: 'handler.hello',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      FirstQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "FirstQueue"
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;
