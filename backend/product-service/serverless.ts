import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service'
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    "serverless-offline": {
      httpPort: 4000,
      lambdaPort: 4001
    }
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: '${opt:stage}',
    tracing: {
      apiGateway: true,
      lambda: true
    },
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '10',
      ENV_STAGE: '${opt:stage}'
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action:"sqs:*",
        Resource: [ "arn:aws:sqs:*" ]
      }
    ],
  },
  package: {
    include: [ '../libs/*' ]
  },
  functions: {
    getProductById: {
      handler: 'handler.getProductById',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            }
          }
        }
      ]
    },
    getAllProducts: {
      handler: 'handler.getAllProducts',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'put',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    removeProduct: {
      handler: 'handler.removeProduct',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'delete',
            path: 'products/{productId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            }
          }
        }
      ]
    },
    catalogBatchProcessProducts: {
      handler: 'handler.catalogBatchProcessProducts',
      memorySize: 256,
      timeout: 20,
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: "${cf:import-service-dev.CatalogItemsQueue}"
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
