# 🔐 Authentication Backend API (Node.js + Express + MongoDB)

This project is a complete **Authentication Backend System** built using **Node.js, Express, MongoDB, Mongoose, and JWT**. It provides secure APIs for user authentication and password management, designed for real-world applications.

---

## ✨ Features

✅ User Registration  
✅ User Login with JWT (stored in HTTP-Only Cookies)  
✅ Logout Functionality  
✅ Change Current Password  
✅ Forgot Password  
✅ Reset Password using Token  
✅ JWT Authentication Middleware  
✅ Input Validation using `express-validator`  
✅ Password Hashing using `bcrypt`  
✅ Clean API Response System  

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- jsonwebtoken (JWT)
- bcrypt
- express-validator
- dotenv
- cookie-parser

---

## 📁 Project Structure

```
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
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

---

## 🚀 How To Run The Project

```bash
# Install dependencies
npm install

# Run the server
npm run dev
```

Server will start at:

```
http://localhost:8000
```

---

## 🔗 API Endpoints

### 1️⃣ Register User

**POST** `/api/v1/auth/register`

```json
{
  "email": "user@example.com",
  "username": "shivam",
  "password": "123456"
}
```

---

### 2️⃣ Login User

**POST** `/api/v1/auth/login`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

✅ Sets secure cookies:

- accessToken
- refreshToken

---

### 3️⃣ Logout User (Protected Route)

**POST** `/api/v1/auth/logout`

**Headers (Optional):**
```http
Authorization: Bearer <accessToken>
```

✅ Clears cookies from browser.

---

### 4️⃣ Change Current Password (Protected)

**POST** `/api/v1/auth/change-password`

```json
{
  "oldPassword": "123456",
  "newPassword": "newpassword123"
}
```

✅ Requires valid login session.

---

### 5️⃣ Forgot Password

**POST** `/api/v1/auth/forgot-password`

```json
{
  "email": "user@example.com"
}
```

✅ Generates a reset token (email functionality can be added later).

---

### 6️⃣ Reset Forgotten Password

**POST** `/api/v1/auth/reset-password/:token`

```json
{
  "newPassword": "newpassword123"
}
```

✅ Resets the user's password.

---

## 🔁 Authentication Flow

1. User logs in
2. Server creates:
   - Access Token (short time)
   - Refresh Token (long time)
3. Tokens are stored in **HTTP-only cookies**
4. Protected routes use middleware `verifyJwt`
5. Logout clears cookies

---

## ⚠️ Important Notes

- For local development, use:
  ```js
  secure: false
  ```

- For production (HTTPS), use:
  ```js
  secure: true
  ```

- Tokens **should not be sent in response body** in production.
- Always use:
  ```js
  httpOnly: true
  ```

---

## 🧪 Testing the API

You can test the APIs using:

- Postman
- Thunder Client
- Hoppscotch

Make sure to enable **cookies** in your API client.

---

## 👨‍💻 Author

**Shivam**  
BE (AI & ML) | First Year | JNNCE Shivamogga  
Learning Backend & Full-Stack Development 🚀
