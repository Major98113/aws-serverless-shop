import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'queue-service'
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
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
    pushDataToQueue: {
      handler: 'handler.pushDataToQueue',
      memorySize: 1024,
      timeout: 60,
      events: [
        {
          http: {
            method: 'get',
            path: 'push-message',
          }
        }
      ]
    },
    getDataFromQueue: {
      handler: 'handler.getDataFromQueue',
      memorySize: 1024,
      timeout: 60,
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              "Fn::GetAtt": [ "FirstQueue", "Arn" ]
            }
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
