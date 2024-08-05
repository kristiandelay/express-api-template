const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { SwaggerTheme, SwaggerThemeNameEnum } = require('swagger-themes');
const os = require('os');
require('dotenv').config();

const theme = new SwaggerTheme();

// Get the local network IP address
function getLocalExternalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const alias of networkInterface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const productionUrl = process.env.PRODUCTION_URL;
const apiSubUrl = process.env.API_SUB_URL || '';

let localIP;
let url;

if (environment === 'production') {
  localIP = productionUrl;
  url = `https://${localIP}${apiSubUrl}`;
} else {
  localIP = getLocalExternalIP();
  url = `http://${localIP}:${port}${apiSubUrl}`;
}

const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple Express User API',
    },
    servers: [
      {
        url: url,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'phoneNumber', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the user',
            },
            name: {
              type: 'string',
              description: 'Name of the user',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the user',
            },
            email: {
              type: 'string',
              description: 'Email of the user',
            },
            password: {
              type: 'string',
              description: 'Password of the user',
            },
          },
          example: {
            id: '609c0d7c8f8b4e33d8c5e7c2',
            name: 'John Doe',
            phoneNumber: '+11234567890',
            email: 'john.doe@example.com',
            password: 'password123',
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
        apiKeyAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

const optionsV1 = theme.getDefaultConfig(SwaggerThemeNameEnum.DARK);
const optionsV2 = theme.getDefaultConfig(SwaggerThemeNameEnum.FLATTOP);


function setupSwagger(app) {
  app.use(`${apiSubUrl}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { persistAuthorization: true } }));
  app.use(`${apiSubUrl}/docs1`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, optionsV1)); // Dark theme documentation
  app.use(`${apiSubUrl}/docs2`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, optionsV2)); // Classic theme documentation
}

module.exports = setupSwagger;
