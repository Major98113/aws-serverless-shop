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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST: 'ziggy.db.elephantsql.com',
      DB_PORT: '5432',
      DB_NAME: 'yqcpikbt',
      DB_USERNAME: 'yqcpikbt',
      DB_PASSWORD: 'LcIjch4PLbGFsHJnLlc-NSJwYxWxXAJ2'
    },
  },
  package: {
    include: [ '../libs/*' ]
  },
  functions: {
    getProductById: {
      handler: 'handler.getProductById',
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
    }
  }
}

module.exports = serverlessConfiguration;
