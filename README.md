## Introduction

This project involved building a backend system for managing folders and documents within a web application. It demonstrates skills in RESTful API development, Docker containerization, and integration with file storage services. The solution meets the specified requirements and provides a solid foundation for further development and production deployment.

## Libraries & DB Used

- **PostgreSQL:** Relational database used for storing folder and document data.
- **Sequelize ORM:** Object-relational mapper for interacting with the PostgreSQL database.
- **Local S3 Mock Service:** Used for simulating S3 interactions for file storage.
- **Express.js:** Framework used for building the RESTful API endpoints in the backend.
- **Docker:** For containerizing the application.

## Backend Structure

- **`src/`**: Contains all source code for the backend.
  - **`controllers/`**: Contains logic for handling HTTP requests and responses.
  - **`models/`**: Defines database models using Sequelize.
  - **`services/`**: Contains business logic and interactions with models.
  - **`routes/`**: Defines API routes and endpoints.
  - **`utils/`**: Utility functions and helpers.
  - **`index.ts`**: The entry point of the application, where the server is initialized and routes are registered.
