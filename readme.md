# Service Admin Feature API

## Overview

The **Service Admin Feature API** provides various administrative functionalities for managing engagements. This API is designed to support a range of administrative tasks and integrates with several dependencies to enhance its operations.

## Features

- API for managing engagement tasks
- Environment-specific configurations
- Testing and development support

## Documentation

The API documentation is available via Swagger. You can view it [here](doc/admin-feature.yam).

## YAML Configuration

The YAML configuration files for deployment or other configurations can be found at the following location:

- **YAML File Location**: `path/to/your/configuration.yml`

## Table of Contents

- [Forking and Cloning](#forking-and-cloning)
- [Database Setup](#database-setup)
- [Installation](#installation)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development](#development)
- [Repository](#repository)
- [Author](#author)
- [Contributors](#contributors)
- [License](#license)

## Forking and Cloning

To contribute to the project or use it locally, follow these steps:

1. **Fork the Repository**:

   - Visit the [GitHub repository](https://github.com/esonpaguia/admin-feature).
   - Click on the "Fork" button in the top-right corner of the page to create a copy of the repository under your own GitHub account.

2. **Clone Your Fork**:

   - After forking, clone the repository to your local machine using the following command:
     ```bash
     git clone git@github.com:<your-username>/admin-feature.git
     ```
   - Replace `<your-username>` with your GitHub username.

3. **Navigate to the Project Directory**:

   ```bash
   cd admin-feature
   ```

4. **Install the Required Dependencies**:
   ```bash
   npm install
   ```
## Database Setup

1. Install Mongo Compass and Rancher Desktop
2. Make sure Rancher Desktop is running
    - On CMD run the following Scipt:
         ```bash
          docker run -d -p 27017:27017 mongo
         ```
    - Go back to Rancher Desktop > Container and check if mongo is running if not you can start it
    
## Scripts

The project includes the following npm scripts:

- **`start`**: Starts the application in production mode.

  ```bash
  npm start
  ```

- **`dev:testing`**: Starts the application in testing mode with `nodemon`.

  ```bash
  npm run dev:testing
  ```

- **`dev:production`**: Starts the application in production mode with `nodemon`.

  ```bash
  npm run dev:production
  ```

- **`dev`**: Starts the application in development mode with `nodemon`.

  ```bash
  npm run dev
  ```

- **`test`**: Runs the test suite using Jest.
  ```bash
  npm test
  ```

## Dependencies

The project uses the following dependencies:

- `@google-cloud/secret-manager`
- `@google-cloud/storage`
- `cookie-parser`
- `cors`
- `debug`
- `dotenv`
- `express`
- `googleapis`
- `http-errors`
- `moment-timezone`
- `mongodb`
- `mongodb-memory-server`
- `mongoose`
- `morgan`
- `multer`
- `node-schedule`
- `pug`

## Development

For development and testing, the project includes these devDependencies:

- `@jest-mock/express`: Mocking tools for Express in Jest.
- `cross-env`: Cross-platform environment variable setting.
- `jest`: JavaScript testing framework.
- `nodemon`: Monitors for file changes and restarts the server.
- `supertest`: Library for testing HTTP servers.

## Repository

- **Type**: Git
- **URL**: [git@github.com:TIP-Internal-Project/tip-tids-service-admin-feature-api.git](git@github.com:TIP-Internal-Project/tip-tids-service-admin-feature-api.git)

## Contributors

Thank you to all the contributors who have helped make this project better. You can see the full list of contributors on the [GitHub contributors page](https://github.com/TIP-Internal-Project/tip-tids-service-admin-feature-api/graphs/contributors).

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.
