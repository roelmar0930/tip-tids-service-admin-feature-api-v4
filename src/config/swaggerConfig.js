const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TIP TIDS Service Admin Feature API',
      version: '1.0.0',
      description: 'API documentation for the TIP TIDS Service Admin Feature. This API provides endpoints for managing tasks, events, team members, reports, and activity logs.',
      contact: {
        name: 'TIP TIDS Team',
        email: 'support@example.com',
        url: 'https://example.com/support'
      },
      license: {
        name: 'Private',
        url: 'https://example.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://production-engagement-app-api-v4-1030302438488.asia-southeast1.run.app',
        description: 'Production server'
      },
      {
        url: 'https://testing-engagement-app-api-v4-bt2dd53vha-as.a.run.app',
        description: 'Testing server'
      }
    ],
    tags: [
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Team Members',
        description: 'Team member management endpoints'
      },
      {
        name: 'Events',
        description: 'Event management endpoints'
      },
      {
        name: 'Reports',
        description: 'Event and compliance reporting endpoints'
      },
      {
        name: 'Images',
        description: 'Image management endpoints'
      },
      {
        name: 'Active Logs',
        description: 'Activity logging endpoints'
      },
      {
        name: 'Health Check',
        description: 'API health check endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
