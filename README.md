# Mini ERP – Backend

Inventory & Sales Management System — Backend API built with Express.js, TypeScript, MongoDB (Mongoose), and JWT Authentication.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Multer (file handling) + ImgBB (image hosting)
- bcryptjs (password hashing)

## Features

- JWT-based authentication with protected routes
- Role-based authorization (Admin, Manager, Employee)
- Product CRUD with image upload, search, and pagination
- Sales creation with automatic stock reduction and grand total calculation
- Dashboard statistics API
- Consistent API response structure and centralized error handling

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── user.model.ts
│   │   ├── product/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   └── product.model.ts
│   │   ├── sale/
│   │   │   ├── sale.controller.ts
│   │   │   ├── sale.service.ts
│   │   │   └── sale.model.ts
│   │   └── dashboard/
│   │       ├── dashboard.controller.ts
│   │       └── dashboard.service.ts
│   ├── utils/
│   │   ├── apiResponse.ts
│   │   ├── apiError.ts
│   │   ├── asyncHandler.ts
│   │   ├── generateToken.ts
│   │   ├── uploadToImgbb.ts
│   │   └── seedAdmin.ts
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js (v18 or higher recommended)
- A MongoDB database (local or MongoDB Atlas)
- An [ImgBB](https://imgbb.com/) API key (for product image uploads)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <backend-repo-url>
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root of the project with the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Seed the Admin user** (creates a default Admin account so you can log in)

   ```bash
   npm run seed:admin
   ```

   Default credentials created:
   - Email: `admin@erp.com`
   - Password: `Admin@123`

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`.

6. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the server in development mode with hot reload |
| `npm run build` | Compile TypeScript to JavaScript (`dist/`) |
| `npm start` | Run the compiled production build |
| `npm run seed:admin` | Seed default Admin (and test Manager/Employee) users |

## Roles & Permissions

| Role | Permissions |
|---|---|
| Admin | Full access to all resources |
| Manager | Manage products (create/update), create sales, view products |
| Employee | View products, create sales |

## API Documentation

See [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) for the full list of endpoints, request/response formats, and authentication requirements.

## Notes

- All protected routes require a `Authorization: Bearer <token>` header.
- Product creation requires an image file (`multipart/form-data`).
- Sales are processed as an atomic operation — stock is validated and reduced within a MongoDB transaction to prevent overselling.