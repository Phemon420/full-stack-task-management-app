# Full-Stack Task Management App

This is a full-stack task management web application built using Node.js, Express, and MongoDB. The app includes authentication features with JWT, and supports multiple user roles (normal user and admin). It fetches data from a MongoDB database, and users can log in, sign up, and access protected routes based on their roles.

---

## 🚀 Getting Started

### 1. Fork the repository

Start by forking this repository to your GitHub account. Then clone your forked repo to your local machine.

### 2. Install dependencies

Once you have forked the repository, navigate to the project folder and run the following command to install the required dependencies:

```bash
npm install

** ### 3. Start the server **

After installing the dependencies, run the following command to start the application:

```bash
nodemon app.js

📋 Features
1. User Authentication
Login & Sign Up Pages: Users can create accounts or log in to access the application.
Role-based Privileges:
Normal User: A regular user can view and manage their tasks.
Admin: An admin can manage all users, tasks, and data in the application.
2. JWT Authentication
JSON Web Tokens (JWT) are used to authenticate users. After successful login, a JWT token is generated and used to protect routes.
Protected Routes: Only authenticated users can access certain routes. Admin routes are protected by an additional authorization layer.
3. Database Integration
The application uses MongoDB as the database to store user data, tasks, and other application data.
MongoDB is used to fetch and store all the necessary items (such as tasks or any other user-related data).

🛠️ Tech Stack
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Development Tools: Nodemon for automatic server restarts
Other Libraries: bcryptjs (for password hashing)

⚠️ Troubleshooting
If you encounter any issues with bcrypt or any native modules, consider using bcryptjs as a fallback.
Ensure you have a .env file with the required environment variables, including your MongoDB URI and JWT secret



### Key points in the `README`:

- **Installation**: You’ve mentioned the steps to install dependencies (`npm install`) and run the server using `nodemon`.
- **Features**: The app's features include login, sign-up, JWT authentication, and role-based access (normal user/admin).
- **Tech Stack**: Includes the backend (Node.js, Express), the database (MongoDB), and JWT for authentication.
- **Folder Structure**: A simple directory structure is outlined to help the developer navigate the project easily.

Feel free to customize the `README.md` further based on your project’s specific requirements or any additional configurations!
