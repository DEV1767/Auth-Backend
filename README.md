This project is a complete Authentication Backend System built using Node.js, Express, MongoDB, Mongoose, and JWT. It provides secure APIs for user authentication and password management, designed for real-world applications.

✨ Features

✅ User Registration
✅ User Login with JWT (stored in HTTP-Only Cookies)
✅ Logout Functionality
✅ Change Current Password
✅ Forgot Password
✅ Reset Password using Token
✅ JWT Authentication Middleware
✅ Input Validation using express-validator
✅ Password Hashing using bcrypt
✅ Clean API Response System

⚙️ Tech Stack

Node.js

Express.js

MongoDB & Mongoose

jsonwebtoken (JWT)

bcrypt

express-validator

dotenv

cookie-parser
src/
│
├── controllers/
│   └── auth.controller.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── models/
│   └── user.models.js
│
├── routes/
│   └── auth.routes.js
│
├── validators/
│   └── auth.validator.js
│
├── utils/
│   ├── api_error.js
│   ├── api_response.js
│   └── async_handler.js
│
├── app.js
└── index.js

User logs in

Server creates:

Access Token (short time)

Refresh Token (long time)
👨‍💻 Author

Shivam
BE (AI & ML)  | JNNCE Shivamogga
Learning Backend & Full-Stack Development 🚀

Tokens are stored in HTTP-only cookies

Protected routes use middleware verifyJwt

Logout clears cookies
