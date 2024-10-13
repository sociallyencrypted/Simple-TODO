# Simple-TODO

## Project Overview
Simple-TODO is a web-based application that allows users to create and manage to-do lists. I made this while learning and experimenting with the FARM stack.

## Implementation Details
The backend is implemented using FastAPI. The application uses MongoDB as the database to store to-do lists and items. The backend exposes a RESTful API that the frontend interacts with to perform CRUD operations on to-do lists and items.

The frontend is built with React, utilizing hooks for state management and Axios for making API calls.

## Setup and Running the Application with Docker Compose

### Prerequisites
- Ensure you have Docker and Docker Compose installed on your machine.

### Steps to Run the Application

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sociallyencrypted/Simple-TODO.git
   cd Simple-TODO
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   MONGODB_URI=<your_mongodb_connection_string>
   DEBUG=true
   ```

3. **Build and Run the Application**
   In the root directory of the project, run the following command to start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - The frontend will be available at `http://localhost:8080`.
   - The backend API will be accessible at `http://localhost:8080/docs`.

5. **Stopping the Application**
   To stop the application, press `CTRL + C` in the terminal where Docker Compose is running, or run:
   ```bash
   docker-compose down
   ```
