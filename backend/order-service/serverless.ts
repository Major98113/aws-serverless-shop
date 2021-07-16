import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'order-service'
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    "serverless-offline": {
      httpPort: 5000,
      lambdaPort: 5001
    }
  },
  plugins: [ 'serverless-webpack', 'serverless-offline' ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
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
    }
  },
  package: {
    include: [ '../libs/*' ]
  },
  functions: {
    getOrderById: {
      handler: 'handler.getOrderById',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'get',
            path: 'orders/{orderId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  orderId: true
                }
              }
            }
          }
        }
      ]
    },
    getAllOrders: {
      handler: 'handler.getAllOrders',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'get',
            path: 'orders',
            cors: true
          }
        }
      ]
    },
    createOrder: {
      handler: 'handler.createOrder',
      memorySize: 256,
      timeout: 10,
      events: [
        {
          http: {
            method: 'put',
            path: 'orders',
            cors: true
          }
        }
      ]
    },
    removeOrder: {
      handler: 'handler.removeOrder',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            method: 'delete',
            path: 'orders/{orderId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  orderId: true
                }
              }
            }
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
