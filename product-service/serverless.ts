import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
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
            path: 'products'
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
    }
  }
}

module.exports = serverlessConfiguration;
