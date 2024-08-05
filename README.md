# Express Api Auth Base Template App

This project is a simple Express-based API with JWT and API key authentication. It allows users to register, login, and generate API keys. The project uses Mongoose for MongoDB interactions and integrates Swagger for API documentation.

## Features

- User Registration
- User Login
- JWT Authentication
- API Key Authentication
- Swagger Documentation
- Morgan Logging
- Custom Error Handling

## Prerequisites

- Node.js
- MongoDB

## Installation

1. Clone the repository
   ```sh
   git clone git@github.com:kristiandelay/express-api-template.git
   cd mongoose-api-app

2. Create a .env file in the root directory and add the following environment variables
.env 
```
    PORT=5000
    NODE_ENV=development
    PRODUCTION_URL=myurl.dev/testapi
    API_SUB_URL="/api/v1"

    MONGODB_URI=mongodb://10.1.10.114:27017

    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token


    JWT_SECRET=LOLNO
    JWT_REFRESH_SECRET=LOLNOREFRESH
```

